var BaseService = require('./BaseService');

userService = function (app) {
    this.app = app;
};
userService.prototype = new BaseService();
userService.prototype.getAccounts = function (request, response, callback){
var accountNumber = request.accountNumber;
var ipAddress = request.ipAddress;
domain.Accounts.find({ AccountNumber: accountNumber})
.select("AccountNumber DateDue AutoPay Frequency PaymentMethod CurrentBalance AmountPastDue RegularAmountDue LoanPaymentMode LastPaymentMade")
.exec().then(function (result){
  var select ={};
 if(result.length === 0 ) 
 {
    select = ({ accountNumber:  accountNumber ,
                AmountPastDue:  '0.00',
                AutoPay: 'No',
                CurrentBalance: '0.00',
                DateDue: null,
                Frequency: null,
                LastPaymentMade: '0.00',
                LoanPaymentMode: '0.00',
                PaymentMethod: null,
                RegularAmountDue: '0.00',
                requestType:'POST',
                count: result.length 
                }); 
 }
 else{
select = ({ accountNumber: result[0]._doc.AccountNumber,
            AmountPastDue:  result[0]._doc.AmountPastDue,
            AutoPay:  result[0]._doc.AutoPay,
            CurrentBalance: result[0]._doc.CurrentBalance,
            DateDue:result[0]._doc.DateDue,
            Frequency: result[0]._doc.Frequency,
            LastPaymentMade:result[0]._doc.LastPaymentMade,
            LoanPaymentMode:result[0]._doc.LoanPaymentMode,
            PaymentMethod:result[0]._doc.PaymentMethod,
            RegularAmountDue:result[0]._doc.RegularAmountDue,
            requestType:'POST',
            count: result.length });
 }
            
            callback(null, select);
}).catch(function (error) {
global.emitter.emit('log','Error in home Service getAccounts Action Method',error,accountNumber,'Error in home Service getAccounts Action Method',ipAddress);
error.status = 500;
callback(error, null)       
});   
}
userService.prototype.fetchData = function (res, callback) {

    // db interaction placed here
    debugger;
    callback(null, "Hi , saurabh pratap singh")
}
// db interaction placed here
userService.prototype.fetchDataPost = function (res, callback) {
    debugger;
    var user = new domain.User({
        accountNumber:'31667',
        fullName: 'saurabh pratap singh',
        email: 'sp@gmail.com',
        password: 'sp@123456',
        mobile: '9456926424'
    });
    user.save(function (err, res) {
        callback(null, res)
    });  
 
    //domain.User.find({}).exec(function (err, res) {
    //    var result = ({ message: "ok", res: res });
        
    //    // callback(null, res)
    //    callback(null, result)
    //})
}
userService.prototype.fetchDataGet = function (res, callback) {
    
    user.save(function (err, res) {
        callback(null, res)
    });
}

module.exports = function (app) {
    return new userService(app);
};
