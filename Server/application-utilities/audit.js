module.exports = function () {

    this.auditInsert = function (accountNumber, message, ipAddress, code) {
        try {
            var Audit = new domain.Audit({
                accountNumber: accountNumber,
                action: 'Insert',
                message: message,
                ipAddress: ipAddress,
                code: code
            });
            Audit.save(function (error, response) {
                if (error) {
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        catch (exception) {
            configurationHolder.Logger.error('Error in Audit auditInsert Method' + exception + '\r\n');
        }
    };

    this.auditUpdate = function (accountNumber, message, ipAddress, code) {
        try {
            var Audit = new domain.Audit({
                accountNumber: accountNumber,
                action: 'Update',
                message: message,
                ipAddress: ipAddress,
                code: code
            });
            Audit.save(function (error, response) {
                if (error) {
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        catch (exception) {
            configurationHolder.Logger.error('Error in Audit auditUpdate Method' + exception + '\r\n');
        }
    };

    this.auditDelete = function (accountNumber, message, ipAddress, code) {
        try {
            var Audit = new domain.Audit({
                accountNumber: accountNumber,
                action: 'Delete',
                message: message,
                ipAddress: ipAddress,
                code: code
            });
            Audit.save(function (error, response) {
                if (error) {
                    return false;
                }
                else {
                    return true;
                }
            });

        }
        catch (exception) {
            configurationHolder.Logger.error('Error in Audit auditDelete Method' + exception + '\r\n');
        }
    }
}
