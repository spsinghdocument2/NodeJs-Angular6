		var appErrorMessages = {
		    failedLogin: "Sorry! Account Number or Email or password do not match.",
		    RequestInvalid: "The request is invalid",
			registeredFaild:"Make sure your account hasn't been registered already.",
		}

		var appSuccessMessage = {
		    alreadyRegister: "This user is already registered",
            RegistrationSuccessful:"Registration Successful",
		}
		var NotificationSubject = {

		}
		var LoginMessage = {
		    registerFirst: "You are not yet registered. It only takes a few moments to register.",
		    loginSuccessful: "Successful Login",

		}
		var RoleAccessMessage = {
		    notRightAuthority: "You are not authorized to create user of this role user"
		}

		module.exports.LoginMessage = LoginMessage
		module.exports.appSuccessMessage = appSuccessMessage
		module.exports.appErrorMessages = appErrorMessages
		module.exports.NotificationSubject = NotificationSubject
		module.exports.RoleAccessMessage = RoleAccessMessage
