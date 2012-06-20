You Got ServeD!
===

Standalane one-liner HTTP webserver for NodeJS

Equivalent of `python -m SimpleHTTPServer 3000` except that `served` also handles POSTed files.

Installation
===

    npm install -g served

Usage
===

    cd /path/to/serve
    served [port]  # defaults to 3000

example:

    cd ~/Downloads
    served 5555

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
