var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');

module.exports = function () {

    this.encrypt = function (text)
    {
        var crypted = cryptr.encrypt(text);
        return crypted;
    };

    this.decrypt = function (text) {
        var decipher = cryptr.decrypt(text);
            return decipher;
    }

}