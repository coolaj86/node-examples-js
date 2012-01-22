Pretty-Print JSON
===

The opposite of `json-minify`;
For all the times you want to add readable whitespace. 

    {"foo":"bar"}

becomes

    {
        "foo": "bar"
    }

Usage
---

    json-prettify /path/to/data.json

    curl -s http://foobar3000.com/echo/echo.json | json-prettify

    wget -qO- http://foobar3000.com/echo/echo.json | json-prettify

Installation
---

    npm install -g json-prettify
