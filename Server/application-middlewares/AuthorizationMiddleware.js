/*
 * @author Abhimanyu
 * This module is for the authorization process . Called as middleware function to decide whether user have enough authority to access the 
 *
 */
var async = require('async')

var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';
var loginsession = false;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    //console.log('payload received', jwt_payload);
      next(null, loginsession);
});

passport.use(strategy);
router.use(passport.initialize());
//backdate a jwt 30 seconds
//var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');

module.exports.AuthorizationMiddleware = (function () {

    ////////////////////////////////////////////////////////

    var getAuthorityToken = function (payload)
    {
        loginsession = true;
        return jwt.sign(payload, jwtOptions.secretOrKey,{
                    algorithm: 'HS256',
                    expiresIn:  3600 // 60  expires in 1 minute
                });
    };
    var authorityToken = function ()
    {   
            return passport.authenticate('jwt', { session: false });
    };
    //////////////////////////////////////

    /*
     *  Verify user is authorized to access the functionality or not
     */
    var verifyIsRoleInAccessLevel = function(next, results, res, req, accessLevel) {
        var roleInAccessLevel = configurationHolder.config.accessLevels[accessLevel]
        var authorized = false
        Logger.log("hello" + roleInAccessLevel + accessLevel)
        domain.User.findOne({
            _id: results.authorizationTokenObject.user,
            deleted: false
        }, function(err, userObject) {

            if (userObject) {
                if (roleInAccessLevel.indexOf(userObject.role) > -1) {
                    authorized = true
                    req.loggedInUser = userObject
                    next(results, authorized)
                } else {
                    configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
                }
            } else {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)

            }
        })

    }


    /*
     * find User and its role using authenticationToken. 
     */
    var findRoleByAuthToken = function(next, results, req, res, authToken) {
        Logger.info("authToken---->" + authToken)
        domain.AuthenticationToken.findOne({
            authToken: authToken
        }, function(err, authObj) {

            if (err || authObj == null) {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
            } else {
                next(null, authObj)
            }
        })
    }

    /*
     *  call as middleware to decide the accessiblity of the function for the loggedIn user
     *  find user by AuthenticationToken
     *  Decide based on the role of user and accesslevel whether user is authorized or not 
     */
    var authority = function (accessLevel) {
       
        return function(req, res, next) {
            var authToken = req.get("X-Auth-Token")
                //console.log(authToken+"---------------"+accessLevel)
            if (authToken == null && accessLevel == "anonymous") {
                Logger.info("executed in accesslevel ")
                req.loggedInUser = null
                next()
            } else if (authToken == undefined && accessLevel == "user") {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
            } else {
                async.auto({
                    authorizationTokenObject: function(next, results) {
                        return findRoleByAuthToken(next, results, req, res, authToken)
                    },
                    isRoleInAccessLevel: ['authorizationTokenObject', function(next, results) {
                        verifyIsRoleInAccessLevel(next, results, res, req, accessLevel)
                    }]
                }, function(err, results) {
                    if (results.isRoleInAccessLevel == true) {
                        next()
                    } else {
                        configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
                    }
                })
            }
        }
    }
    var updateUserTime = function(next, results, req, res) {
        Logger.info("control in the update user active time" + results.authorizationTokenObject.user);
        var updated = false;
        domain.User.update({
            _id: results.authorizationTokenObject.user
        }, { $set: { lastActiveTime: new Date() } }, function(err, userObject) {
            if (userObject) {
                updated = true;
                next(results, updated);
            } else {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
            }
        });

        //        Login.updateOne({name:name},{$set: {role:role,password:password}},
    }
    var lastActiveTime = function () {
            return function(req, res, next) {
                var authToken = req.get("X-Auth-Token");
                Logger.info("authtoken" + authToken);
                if (authToken != "undefined" || authToken != null) {
                    Logger.info("enter in middleware to update the last active time");
                    async.auto({
                        authorizationTokenObject: function(next, results) {
                            return findRoleByAuthToken(next, results, req, res, authToken)
                        },
                        updateLastActiveTime: ['authorizationTokenObject', function(next, results) {
                            updateUserTime(next, results, res, req)
                        }]
                    }, function(err, results) {
                        next();
                    })
                } else {
                    Logger.info("no authToken find so user last active time is not updated");
                    next();
                }
            }

        }
        //public methods are  return
    return {
        authority: authority,
        lastActiveTime: lastActiveTime,
        getAuthorityToken: getAuthorityToken,
        authorityToken: authorityToken

    };
})();
