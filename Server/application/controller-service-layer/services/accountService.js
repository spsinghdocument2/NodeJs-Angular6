var BaseService = require('./BaseService');
var encrypt = require('../../../application-utilities/EncryptionUtility');

var encryptDecrypt = new encrypt();
var audit = new common.audit();
 var sendMail = new common.sendMail();
userService = function (app)
{
    this.app = app;
};
userService.prototype = new BaseService();
userService.prototype.login = function (request, response, callback)
{
    var userAccountNumber = request.accountNumber;
    var userPassword = encryptDecrypt.encrypt(request.password);
    var userEmail = request.email;
    var ipAddress = request.ipAddress;
  domain.User.find({ accountNumber: userAccountNumber, email: userEmail, password: userPassword, isAccountActive: true })
  .select("accountNumber id mobile userImage email fullName gender").exec().then(function (result)
    {
        if (result != undefined && result != null && result.length === 0)
        {
            var response = ({ message: configurationHolder.ResourceFile.appErrorMessages.failedLogin,login:false });
            callback(null, response)
        }
        else
        {
         domain.User.findOneAndUpdate({ accountNumber: userAccountNumber }, { $set: { lastActiveTime: Date.now() } })
         audit.auditInsert(userAccountNumber, 'client login', ipAddress, 'login'); 
         var payload = { id: result.id };
         var tok = configurationHolder.security.getAuthorityToken(payload);
         var response = ({ message: configurationHolder.ResourceFile.LoginMessage.loginSuccessful, token: tok, count: result.length,
                         requestType:'POST',login:true,_id:result[0]._id,fullName:result[0].fullName,email:result[0].email,gender:result[0].gender,mobile:result[0].mobile,
                        accountNumber:userAccountNumber});
         request.session.login=true;
         callback(null, response)  
     }
    }).catch(function (error) {
        //    throw new Error("Something went wrong...");
        global.emitter.emit('log','Error in Account Service login Action Method',error,userAccountNumber,'Error in Account Service login Action Method',ipAddress);
        error.status = 500;
        callback(error, null)       
    });   
}

userService.prototype.forgotPassword = function (request, response, callback) {
    var userAccountNumber = request.accountNumber;
    var ipAddress = request.ipAddress;
    domain.User.find({ accountNumber: userAccountNumber, isAccountActive: true }).then(function (result)
    {
        if (result != undefined && result != null && result.length > 0)
        {
            const fullName = result[0].fullName;
            const accountNumber = result[0].accountNumber;
            const email = result[0].email;
            const Password = encryptDecrypt.decrypt(result[0].password);
            sendMail.forgotPassword(fullName, accountNumber, email, Password, ipAddress);
            callback(null, ({ message: true }));
        }
        else
        {
            var result = ({ message: false });
            callback(null, result)
        }
    }).catch(function (error)
    {
        global.emitter.emit('log','Error in Account Service forgotPassword Action Method',error,userAccountNumber,'Error in Account Service forgotPassword Action Method',ipAddress);
        error.status = 500;
        callback(error, null)
    });

};

userService.prototype.createAccount = function (request, response, callback) {
    var userAccountNumber = request.accountNumber;
    var userPassword = encryptDecrypt.encrypt(request.password);
    var userEmail = request.email;
    var fullName = request.fullName;
    var mobile = request.mobile;
    var ipAddress = request.ipAddress;
  domain.User.find({$or:[{accountNumber: userAccountNumber},{email:userEmail},{mobile:mobile}]}).then((result) =>{
  if(result.length === 0)
  {
     var user = new domain.User({
        accountNumber:userAccountNumber,
        fullName: fullName,
        email: userEmail,
        password: userPassword,
        mobile: mobile
    });
user.save(function (request, response) {
    if(!request)
    {
    audit.auditInsert(userAccountNumber, 'Registration Successful', ipAddress, 'createAccoun');
    sendMail.Register(fullName, userAccountNumber, userEmail, encryptDecrypt.decrypt(userPassword), ipAddress);
    callback(null, configurationHolder.ResourceFile.appSuccessMessage.RegistrationSuccessful);
    }
    else 
    {
        callback(null, configurationHolder.ResourceFile.appErrorMessages.RequestInvalid)
    }
    });  
  }
  else
  {
    callback(null, configurationHolder.ResourceFile.appErrorMessages.registeredFaild)
  }
 }).catch( (error) => {
 global.emitter.emit('log','Error in Account Service createAccount Action Method',error,userAccountNumber,'Error in Account Service createAccount Action Method',ipAddress);
 error.status = 500;
 callback(error, null)
 })
 
};
module.exports = function (app) {
    return new userService(app);
};