You Got ServeD!
===

Standalane one-liner HTTP webserver for NodeJS

Equivalent of `python -m SimpleHTTPServer 3000` except that `served` also handles POSTed files.

Installation
===

    npm install -g served

Usage
===

    served [port] [/path/to/serve] # defaults to 3000 and the current directory

example:

    cd ~/Downloads
    served 5555

Note: If `/path/to/serve` can be loaded as a connect module with `require()`, it will be. For example:

    served 5555 /path/to/myapp.js

Receiving Files
---

Files will NOT be overwritten.

Files will be received to the filename they were posted as.

    cd /tmp
    served 5555 &

    cd ~/
    echo 'Hello Test World!' > hello-test.txt
    curl http://localhost:5555/ignored-path/hello.txt \
      -X POST \
      --data-binary @hello-test.txt

    cat /tmp/hello.txt
    > Hello Test World!

License
===

Copyright (c) 2011 AJ ONeal under the MIT and Apachev2 Licenses.

See LICENSE.MIT
