var xml2js       = require('xml2js');
var BaseService = require('./BaseService');
var parser       = new xml2js.Parser();
var fs           = require('fs');

paymentAgreementService = function(app) {
this.app = app;
 };
paymentAgreementService.prototype = new BaseService();

paymentAgreementService.prototype.getPaymentAgreement = function (request, response, callback){
let xmlfile = __dirname;
xmlfile = xmlfile.split("application");
let path = xmlfile[0] + 'Fee.xml';
let accountNumber = request.accountNumber;
let ipAddress = request.ipAddress;
 fs.readFile(path, 'utf-8', function (error, data){
if(error)
{
global.emitter.emit('log','Error in payment agreement Service getPaymentAgreement Action Method',error,accountNumber,'Error in home Service getAccounts Action Method',ipAddress);
error.status = 500;
callback(error, null)        
}
else{
parser.parseString(data, function (error, result) {
if(error)
{
global.emitter.emit('log','Error in payment agreement Service getPaymentAgreement Action Method',error,accountNumber,'Error in home Service getAccounts Action Method',ipAddress);
error.status = 500;
callback(error, null)        
}
else{    
callback(null, ({fee:result.feeStructure.achPayments[0].achPayment[0].fee[0]}));
}
});
}
  });
}
 module.exports = function(app) {
return new paymentAgreementService(app);
};