
module.exports = function () {
var userLogin = {};
var user= {};
var error = {};
var requestInvalid = ({ message: configurationHolder.ResourceFile.appErrorMessages.RequestInvalid });
    var login = function (request, response, callback)
    {
        if (!request.body.accountNumber)
        {
            error.status = 400;
            callback(error, requestInvalid)
        }
        else if(!request.body.password)
        {
           error.status = 400;
            callback(error, requestInvalid)    
        }
        else if(!request.body.email)
        {
           error.status = 400;
            callback(error, requestInvalid)    
        }
        else
        {
            try
            {
                userLogin.accountNumber = request.body.accountNumber;
                userLogin.password = request.body.password;
                userLogin.email = request.body.email;
                userLogin.ipAddress = request.ip;
                userLogin.session = request.session
                this.services.accountService.login(userLogin, response, callback);               
            }
            catch(error)
            {
                configurationHolder.Logger.error('Error in Account Controller login Action Method' + error + '\r\n');
            }
        }
    }

    var forgotPassword = function (request, response, callback)
    {
        if (!request.body.accountNumber)
        {
            error.status = 400;
            callback(error, requestInvalid)
        }
        else {
            try
            {
                user.accountNumber = request.body.accountNumber;
                user.ipAddress = request.ip
                this.services.accountService.forgotPassword(user, response, callback);
            }
            catch (exception)
            {
                configurationHolder.Logger.error('Error in Account Controller forgotPassword Action Method' + exception + '\r\n');
            }
        }
    }

    var createAccount = function (request, response, callback)
    {
        if (!request.body.accountNumber )    
        {
            error.status = 400;
            callback(error, requestInvalid)
        }
        else if(!request.body.password){
            error.status = 400;
            callback(error, requestInvalid)
        }
        else if(!request.body.email){
            error.status = 400;
            callback(error, requestInvalid) 
        }
        else if(!request.body.fullName){
            error.status = 400;
            callback(error, requestInvalid) 
        }
        else if(!request.body.mobile){
            error.status = 400;
            callback(error, requestInvalid)
        }
        else
        {
            user.accountNumber = request.body.accountNumber;
            user.password = request.body.password;
            user.email = request.body.email;
            user.fullName = request.body.fullName
            user.mobile = request.body.mobile
            user.gender = request.body.gender
            user.userImage = request.body.userImage
            user.city = request.body.city
            user.facebookId = request.body.facebookId
            user.ipAddress = request.ip
            this.services.accountService.createAccount(user, response, callback);
        }
    }
    return {
        login: login,
        forgotPassword: forgotPassword,
        createAccount: createAccount,
    }
};