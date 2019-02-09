   global.emitter.on('log',function(message,error,accountNumber,action,ipAddress)
   {
      configurationHolder.Logger.error(message + error + '\r\n');
        var Log = new domain.Log({
            accountNumber: accountNumber,
            action: action,
            ipAddress: ipAddress,
            exception: error
        });
        Log.save();
     });