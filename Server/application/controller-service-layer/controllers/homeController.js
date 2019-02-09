module.exports = function () {
    var user= {};
    var error = {};
   var requestInvalid = ({ message: configurationHolder.ResourceFile.appErrorMessages.RequestInvalid });
    var getAccounts = function (request, response, callback) {
       if (!request.params.id)
        {
            error.status = 400;
            callback(error, requestInvalid)
        }
        else{
                user.accountNumber = request.params.id;
                user.ipAddress = request.ip
                this.services.homeService.getAccounts(user, response, callback);
        }
    }
    
    var fetchData = function (req, res, callback) {

        this.services.homeService.fetchDataPost(res, callback);
    }
    var login = function (req, res, callback) {
        this.services.homeService.login(req.body,res, callback);
    }


    return {
        getAccounts:getAccounts,
        fetchData: fetchData,
        login: login,

    }
};