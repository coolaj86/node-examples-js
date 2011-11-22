#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , forEachAsync = require('forEachAsync')
    , config = JSON.parse(fs.readFileSync(process.env.HOME + '/.mailed.conf'))
    , nodemailer = require('nodemailer')
    , to = process.argv[2]
    , subject = (process.argv[3] || '').replace('\n', ' ')
    , body = process.argv[4]
    , attachment = process.argv.splice(5, process.argv.length-1) // get all attachments
    , attachments = []
    , headers
    ;

  nodemailer.SMTP = {
      host: config.host // required
    , port: config.port // optional, defaults to 25 or 465
    , ssl: config.ssl
    , use_authentication: config.use_authentication // optional, false by default
    , user: config.user  // used only when use_authentication is true 
    , pass: config.pass  // used only when use_authentication is true
  };
 
  function doMailing() {
    headers = {
      "to": to
    , "reply_to": config.reply_to
    , "subject": subject
    , "sender": config.sender // add this to your e-mail aliases
    , "body": body
  //, "html": unused
    , "attachments": attachments
    };

    nodemailer.send_mail(headers, function (err) {
      if (err) {
        console.error(err.message || 'Didn\'t work');
        return;
      }
      console.log('Sent mail. <(^_^<) W00T!');
    });
  }

  if (!to || !subject || !body) {
    console.log('mailed "<email [, email]>" "<subject>" "<body>" <path-to-attachment>');
    console.log('mailed "John Doe <john.doe@gmail.com>" "Craptacula Discovered" "Something Bod Happened. See Attached Log." /path/to/attachment.log');
    return;
  }

  forEachAsync(attachment, function (next, attach) {
    var data;
    
    data = fs.readFileSync(attach);
    attachments.push({
        "filename": attach.split('/').pop()
      , "contents": data
    });

    next();
  }).then(doMailing);
}());