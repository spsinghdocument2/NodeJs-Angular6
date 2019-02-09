	module.exports = function(app) {
	    var controllers = app.controllers,
	        views = app.views;

	    return {
	        "/api/v1/userapi/fetchData": [{
	            method: "GET",
	            action: app.controllers.userController.fetchData,
	            //middleware: [configurationHolder.security.authority("user")],
	            middleware: [configurationHolder.security.authorityToken()],
               // middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],
			 "/api/v1/userapi/fetchData2": [{
	            method: "GET",
	            action: app.controllers.userController.fetchData2,
	            middleware: [configurationHolder.security.authorityToken()],
	            views: {
	                json: views.jsonView
	            }
	        }],
			"/api/userapi/getLoginAudit/:pageNumbe/:size": [{
	            method: "GET",
	            action: app.controllers.userController.getLoginAudit,
	            middleware: [configurationHolder.security.authorityToken()],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/home/fetchData": [{
	            method: "GET",
	            action: app.controllers.homeController.fetchData,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],
			"/api/home/getAccounts/:id": [{
	            method: "GET",
	            action: app.controllers.homeController.getAccounts,
	            middleware: [configurationHolder.security.authorityToken()],
	            views: {
	                json: views.jsonView
	            }
	        }],
			"/api/paymentAgreement/getPaymentAgreement/:id": [{
	            method: "GET",
	            action: app.controllers.paymentAgreementController.getPaymentAgreement,
	            middleware: [configurationHolder.security.authorityToken()],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/account/login": [{
	            method: "POST",
	            action: app.controllers.accountController.login,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/account/forgotPassword": [{
	            method: "POST",
	            action: app.controllers.accountController.forgotPassword,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/account/createAccount": [{
	            method: "POST",
	            action: app.controllers.accountController.createAccount,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],

	    };
	};
