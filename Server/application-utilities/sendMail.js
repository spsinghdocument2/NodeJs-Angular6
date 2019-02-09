'use strict';

const nodemailer = require('nodemailer');
var util = require('util');
var audit = new common.audit();
const mailHtmlBody = "<html>" +
                      " <body>" +
                      "<table width='100%' border='0' cellspacing='0' cellpadding='0' bgcolor='#fff'>" +
                      "<tbody>" +
                      "<tr>" +
                      "<td>" +
                      "<table width='600' border='0' cellspacing='0' cellpadding='0' bgcolor='#FFFFFF' align=center style='border:1px solid #4a9dd4'>" +
                      "<tbody>" +
                      "<tr>" +
                      "<td style='text-align: center; padding: 20px 10px;border-top: 3px solid #2185c5;'><a href='http://www.midfinance.com' target='_blank'><img src='https://www.midfinance.com/images/logo.jpg' width='200' height='61' border='0' ></a></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td width='100%' align='left' valign='top' style='padding:0px 20px 10px;'>" +
                      "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                      "<tbody>" +
                      "<tr>" +
                      "<td height='25' align='left' valign='middle' ><font style='font-family: Arial, Helvetica, sans-serif; color:#353535; font-size:14px; font-weight:normal;'>Dear %s,</font></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td height='25' align='left' valign='middle' ><font style='font-family: Arial, Helvetica, sans-serif; color:#353535; font-size:13px; font-weight:normal; line-height:22px;'>Greetings from Mid-Atlantic Finance Company!</font></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td height='25' align='left' valign='middle' ><font style='font-family: Arial, Helvetica, sans-serif; color:#353535; font-size:13px; font-weight:normal; line-height:22px;'>%s</font></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td height='50' align='left' valign='middle' ><font style='font-family: Arial, Helvetica, sans-serif; color:#353535; font-size:13px; font-weight:normal; line-height:22px;'>Looking forward to more opportunities to be of service to you.</font></td>" +
                      "</tr>" +
                      "</tbody>" +
                      "</table>" +
                      "</td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td width='100%' align='left' valign='top' style='padding:0px 20px 10px;'>" +
                      "<table width='100%' border='0' cellspacing='0' cellpadding='0' style='margin-top:10px;'>" +
                      "<tr>" +
                      "<td height='25' align='left' valign='middle' ><font style='font-family: Arial, Helvetica, sans-serif; color:#353535; font-size:14px; line-height:22px;'>Thank you,<br/>" +
                      "Mid-Atlantic Finance Company<br/>" +
                      "Web Administrator<br/>" +
                      "</font></td>" +
                      "</tr>" +
                      "</table></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td>&nbsp;</td>" +
                      "</tr>" +
                      "</tbody>" +
                      "</table></td>" +
                      "</tr>" +
                      "</tbody>" +
                      "</table>" +
                      "</body>" +
                      "</html>";
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: configurationHolder.config.configVariables('sendMailConfig').host,
        port: configurationHolder.config.configVariables('sendMailConfig').port,
        secure: configurationHolder.config.configVariables('sendMailConfig').secure, // true for 465, false for other ports                
        service: configurationHolder.config.configVariables('sendMailConfig').service,
        auth:
            {
                user: configurationHolder.config.configVariables('sendMailConfig').authorizationUser,
                pass: configurationHolder.config.configVariables('sendMailConfig').authorizationPassword
            },
        tls:
            {
                rejectUnauthorized: configurationHolder.config.configVariables('sendMailConfig').rejectUnauthorized
            }
    });
    function send(email, subject, body, accountNumber, ipAddress,action)
    {
        try {
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Midfinance" <"' + email + '">', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                // text: 'Hello world sp?', // plain text body
                html: body // html body
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (!error)
                {
                    audit.auditInsert(accountNumber, body, ipAddress, action);
                }
            });
        }
        catch (error) {
            configurationHolder.Logger.error('Error in sendMail "' + action + '" Action Method' + error + '\r\n');
            var Log = new domain.Log({
                accountNumber: accountNumber,
                action: 'Error in sendMail "' + action + '" Action Method',
                ipAddress: ipAddress,
                exception: error
            });
            Log.save();
        }
    }

    module.exports = function () {
        // send mail ForgotPassword
        this.forgotPassword = function (fullName, accountNumber, email, Password, ipAddress)
        {
            // https://www.midfinance.com/images/logo.jpg
            // http://localhost:3003/logo.jpg
            //var imageLogoPath = path.resolve('./public/logo.jpg');
            var subject = "Online Payment Access";
            var body = util.format(mailHtmlBody, fullName,
                "We are sending your login information as per your request. <br>You can now login using the following information.<br><br>MAF Account Number: <b>" + accountNumber + "</b><br>Email (username):<b>" + email + "</b><br>Password:<b>" + Password + "</b>");
            send(email, subject, body, accountNumber, ipAddress, 'forgotPassword')

        }
        // send mail  registertion
        this.Register = function (fullName, accountNumber, email, Password, ipAddress)
        {
            var subject = "MAF Online Payment Account";
            var body = util.format(mailHtmlBody, fullName,
                "Thank you for choosing the online payment powered by CallPass Tech, LLC. We are sending your login information. <br>You can now login using the following information.<br><br>MAF Account Number: <b>" + accountNumber + "</b><br>Email (username):<b>" + email + "</b>");
            send(email, subject, body, accountNumber, ipAddress, 'createAccount')
        }
    }