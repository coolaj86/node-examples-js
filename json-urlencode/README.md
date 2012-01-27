URL Encode JSON
===

For all the times you want to pass JSON in an HTTP GET (which should be quite rare, btw)

    {
        "foo":"bar"
    }

becomes

    %7B%22foo%22%3A%22bar%22%7D

Usage
---

    json-urlencode example.json

    curl -s http://foobar3000.com/echo/echo.json | json-urlencode

    wget -qO- http://foobar3000.com/echo/echo.json | json-urlencode

Installation
---

    npm install -g json-urlencode
