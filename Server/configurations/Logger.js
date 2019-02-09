var fs = require('fs')
 , Log = require('log')
 , log = new Log('debug', fs.createWriteStream('logFile.log'));


var error = function (error) {
    log.error(error);
};
var debug = function (debug) {
    log.debug(debug);
};
var info = function (info) {
    log.info(info);
};
module.exports.error = error;
module.exports.debug = debug
module.exports.info = info
