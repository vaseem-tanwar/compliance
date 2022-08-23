var nodemailer = require('nodemailer');
var config = require('../config.js');
module.exports = function(mailType) {
    var from  = config.email.MAIL_USERNAME; // set default mail here
    // define mail types
    var mailDict = {
        "forgotPasswordMail" :{
            subject : "Forgot Password",
            html    : require('./forgotPasswordMail'),
        },
        "ResetPasswordLinkMail" :{
            subject : "Forgot Password",
            html    : require('./ResetPasswordLinkMail'),
        },
        "adminRegisterMail":{
            subject : "Welcome to Teammate",
            html    : require('./adminRegisterMail'),
        },
        "CompanyRegistrationMail":{
            subject : "Welcome to Teammate",
            html    : require('./CompanyRegistrationMail'),
        },
        "userRegisterMail":{
            subject : "Welcome to Teammate",
            html    : require('./userRegisterMail'),
        },
        "retailerRegisterMail":{
            subject : "Welcome to Teammate",
            html    : require('./retailerRegisterMail'),
        },
        "restoreAccountMail":{
            subject : "Deleted account restored",
            html    : require('./restoreAccountMail'),
        }
    }
// create reusable transporter object using the default SMTP transport to send mail from this account
    var transporter = nodemailer.createTransport(require('nodemailer-smtp-transport')({
        host    : "smtp.gmail.com",
        port    : 465,
        secure  : true,
        debug   : true,
        auth    : {
            user    : config.email.MAIL_USERNAME,
            pass    : config.email.MAIL_PASS,
            //xoauth2 : "U01UQ0tHczZuaVZGWUJnQ3BpbU5CQTVDWWwzYU1oNnJoNU9iMDFSVk5LMSszSURRY3pkTVVuOXo5WlJXMWpOc1o3YkhOc0kvMnBrPQ=="
        },    
        maxMessages : 100,
        requireTLS : true,
    }));
    return function(to, data, sendPdf, pdfTemplate) {  // pass mailbody only when sendPdf is true
        var self =  {
            send : function() {
                var mailOptions = mailDict[mailType];
                mailOptions.from = from;
                mailOptions.to   = to; // to;
                mailOptions.html = self.handleVars(mailOptions.html, data);
                if(sendPdf) {
                    pdf.create( self.handleVars(pdfTemplate, data)).toBuffer(function(err, b) {
                        // template becomes pdf so pass mailbody
                        mailOptions.attachments = [{
                                filename : 'Monthly Statement.pdf',
                                contentType : 'application/pdf',
                                content  : b
                            }];
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return ;
                            }
                        });
                    })
                } else {
                    // send mail with defined transport object
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return ;
                        }
                        console.log('Message sent: ' + info.response);
                    });
                }
            },
            transporter : transporter,
            getMappedValue : function(s, o) { // cannot handle arrays
                var l = s.split(".");
                var r = o;
                if(l.length > 0) {
                    l.forEach(function(v, i) {
                        if(v && r[v] !== undefined) {
                            r = r[v];
                        }
                    })
                    return r;
                }
                return undefined;
            },
            handleVars : function(html, o) {
                (html.match(/\{\{\s+([^}]*)\s+\}\}/g) || []).forEach(function(w, i) {
                    var s = w.replace(/^\{\{\s+/, "").replace(/\s+\}\}$/, "");
                    var v = self.getMappedValue(s, o);

                    // handle special cases that need processing
                    // date
                    if(s === 'publishedDate' && v != undefined) {
                        // locale format date
                        v = new Date(v).toString();
                    }
                    if(s==='@validUpto' && v ===null){
                        v = 'NA';
                    }
                    if(s==='@userTotalSpace' && v===null){
                        v=0;
                    }
                    if(s==='@userFreeSpace' && v===null){
                        v=0;
                    }
                    if(s==='@currentPlan' && v===null){
                        v='Freedom';
                    }
                    if(s==='@userJunkSpace' && v===null){
                        v=0;
                    }
                    // replace
                    if(v !== undefined) {
                        html = html.replace(w, String(v));
                    }
                })
                return html;
            },
        };
        return self;
    }
}
// usage
// require("./modules/sendmail")('userSignupSuccess')("to@to.to", data).send();
