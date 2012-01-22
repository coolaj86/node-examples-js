Minify JSON
===

The opposite of Pretty-Print JSON;
For all the times you want to rid of whitespace. 

    {
        "foo": "bar"
    }

becomes

    {"foo":"bar"}

Usage
---

Specify a file:

    json-minify /path/to/data.json

Or pipe from stdin:

    curl -s http://foobar3000.com/echo/echo.json | json-minify

    wget -qO- http://foobar3000.com/echo/echo.json | json-minify

Installation
---

    npm install -g json-minify
