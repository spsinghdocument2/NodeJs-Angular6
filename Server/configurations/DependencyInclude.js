 global.express = require('express');
 global.mongoose = require('mongoose');
 global._ = require('underscore');
 global.async = require('async');
 global.errorHandler = require('errorhandler');
 global.events = require('events');
 global.emitter =new global.events.EventEmitter();
 
     // global.mongooseSchema = mongoose.Schema;
 global.dbConnection = require('./Datasource.js').getDbConnection();
 global.configurationHolder = {};
 global.common = {};

 configurationHolder.config = require('./Conf.js')
 configurationHolder.http = require('../application-middlewares/HttpCaller').HttpCaller
     //Application specific intial program to execute when server starts
 configurationHolder.Bootstrap = require('./Bootstrap.js')
     // Application specific security authorization middleware
 configurationHolder.security = require('../application-middlewares/AuthorizationMiddleware').AuthorizationMiddleware
//UTILITY CLASSES
//Application all Messages 
 configurationHolder.ResourceFile = require('./ApplicationMessages.js')
//Application log file
 configurationHolder.Logger = require('./Logger.js')
//Application audit
 common.audit = require('../application-utilities/audit.js')
 common.sendMail = require('../application-utilities/sendMail.js')

 global.url = require('../application-utilities/Domainurlapi.js').url
var log = require('../application-utilities/log.js');

 module.exports = configurationHolder
