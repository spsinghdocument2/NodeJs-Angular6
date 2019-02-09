global.cors = require('cors');
var express = require('express'),
notFoundHandler = require("./application-middlewares/NotFoundHandler"),
NotFound = require("./application-middlewares/error/NotFound");
//console.log("cors is already running")
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var morgan = require('morgan');
var session = require('express-session');
global.crypto = require('crypto');
global.multipartMiddleware = multipart();
global.app = module.exports = express();
global.errorHandler = require('errorhandler');
global.publicdir = __dirname;
global.async = require('async');
global.path = require('path')
global.router = express.Router();
global.uuid = require('node-uuid');
global.mongooseSchema = mongoose.Schema;
global.configurationHolder = require('./configurations/DependencyInclude.js');
global.domain = require('./configurations/DomainInclude.js');
//console.log("configurationHolder", configurationHolder.Bootstrap)
app.use(errorHandler());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE');
    //response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Auth-Token Authorization");
    response.setHeader("Access-Control-Allow-Headers" , "Content-Type,Authorization");
    response.setHeader('Access-Control-Allow-Credentials', true); 
    next();
}); 
var methodOverride = require('method-override');
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8'
}));
Layers = require('./application-utilities/layers').Express;
var wiring = require('./configurations/UrlMapping');
new Layers(app, router, __dirname + '/application/controller-service-layer', wiring);
/**
 *Handling 404 Errors
 */
//app.use(notFoundHandler);
configurationHolder.Bootstrap.initApp()

// npm init
// chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=localhost:9229/b8b0192a-fea8-4bdc-bd69-4f434029ee6a
// node --inspect --debug-brk server
//(install google chrome ) https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj/related?hl=en
// npm install --save morgan
//npm uninstall --save morgan
//Ctrl +k ---then-  Ctrl +c  //all comment
//Ctrl +k ---then-  Ctrl +u  //all comment
// alt + shift + A
// ctrl+ f === f3 // find