

var NotFound = require("./error/NotFound"),
    errorView = require('../application/controller-service-layer/views/ErrorView');

module.exports = function notFoundHandler(req, res, next) {
    debugger;
    errorView.render(req, res, new NotFound("The requested resource could not be found."));
};