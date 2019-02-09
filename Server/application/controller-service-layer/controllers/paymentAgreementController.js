module.exports = function () {
    var user= {};
    var error = {};
   var requestInvalid = ({ message: configurationHolder.ResourceFile.appErrorMessages.RequestInvalid });
    var getPaymentAgreement = function (request, response, callback) {
   if (!request.params.id)
        {
            error.status = 400;
            callback(error, requestInvalid)
        }
        else
        {
                user.accountNumber = request.params.id;
                user.ipAddress = request.ip
                this.services.paymentAgreementService.getPaymentAgreement(user, response, callback);
        }
    }
     return {
        getPaymentAgreement:getPaymentAgreement
    }
}