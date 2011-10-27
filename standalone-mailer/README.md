You MaileD It!
===

Standalane one-liner SMTP mailer for NodeJS

Installation
===

    npm install -g mailed

Edit `${HOME}/.mailed.conf` and season to taste (in the style of `nodemailer`).

    {
        "host": "smtp.gmail.com"
      , "ssl": true
      , "port": 465
      , "use_authentication": true
      , "user": "jane.doe@gmail.com"
      , "pass": "xxxx yyyy zzzz qqqq"
      , "sender": "Jane Doe <jane.doe@gmail.com>"
      , "reply_to": "Jane's Autobot <jane.doe+autobot@gmail.com>"
    }

Usage
===

    mailed "<email [, email]>" "<subject>" "<body>" [<path-to-attachment>]

Example:

    mailed "John Doe <john.doe@gmail.com>" "Craptacula Discovered in Drain Pipes" "Something Bod Happened. See Attached Log." /path/to/attachment.log

License
===

Copyright (c) 2011 AJ ONeal under the MIT license.

See LICENSE.MIT
