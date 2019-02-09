global.domain = {}

// domain.notifications = require("../application/models/Notifications.js")
// domain.video = require("../application/models/video.js")
// domain.course = require("../application/models/course.js")
// domain.event =require("../application/models/event.js")
domain.User = require("../application/models/user.js");
// domain.registrationToken =require("../application/models/registrationToken.js");
domain.Audit = require("../application/models/audit.js");
domain.Log = require("../application/models/log.js");
domain.Accounts = require("../application/models/accounts.js");
module.exports = domain
