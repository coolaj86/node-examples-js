#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , config = JSON.parse(fs.readFileSync(process.env.HOME + '/.mailed.conf'))
    , nodemailer = require('nodemailer')
    , to = process.argv[2]
    , subject = (process.argv[3] || '').replace('\n', ' ')
    , body = process.argv[4]
    , attachment = process.argv[5]
    , attachments = []
    , headers = {
          "to": to
        , "reply_to": config.reply_to
        , "subject": subject
        , "sender": "Big Bad Wolf <hub@spotter360.com>" // add this to your e-mail aliases
        , "body": body
      //, "html": unused
        , "attachments": attachments
      }
    ;

  function doMailing() {
    nodemailer.send_mail(headers, function (err) {
      if (err) {
        console.error(err.message || 'Didn\'t work');
        return;
      }
      console.log('Sent mail. :-D');
    });
  }

  if (!to || !subject || !body) {
    console.log('mailed "<email [, email]>" "<subject>" "<body>" <path-to-attachment>');
    console.log('mailed "John Doe <john.doe@gmail.com>" "Craptacula Discovered" "Something Bod Happened. See Attached Log." /path/to/attachment.log');
    return;
  }

  nodemailer.SMTP = {
      host: config.host // required
    , port: config.port // optional, defaults to 25 or 465
    , ssl: config.ssl
    , use_authentication: config.use_authentication // optional, false by default
    , user: config.user  // used only when use_authentication is true 
    , pass: config.pass  // used only when use_authentication is true
  }; 
  
  if (!attachment) {
    doMailing();
    return;
  }

  fs.readFile(attachment, function (err, data) {
    if (err) {
      body = 'ERROR: ' + err.message + '\n' + body;
    } else {
      attachments.push({
          "filename": attachment.split('/').pop()
        , "contents": data
      });
    }
    doMailing();
  });
}());
