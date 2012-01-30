YAML to JSON
===

The purpose of this utility is to print YAML (ignore the misnomer, it's actually an object notation) as JSON

You see, JSON is a proper subset of YAML, The difference is that YAML can use whitespace instead of syntax, which is more human-readable.
Also, YAML supports comments.

So, for all the times you want to turn YAML (YML) into JSON.

    ---
      foo: bar
      baz:
        - qux
        - quxx
      corge: null
      grault: 1
      garply: true
      waldo: "false"
      fred: undefined

becomes

    {
      "foo": "bar",
      "baz": [
        "qux",
        "quxx"
      ],
      "corge": null,
      "grault": 1,
      "garply": true,
      "waldo": "false",
      "fred": "undefined"
    }

Usage
---

Specify a file:

    yaml2json ./example.kml

    json2yaml ./example.json | yaml2json

Or pipe from stdin:

    curl -s http://foobar3000.com/echo/echo.json | json2yaml | yaml2json

    wget -qO- http://foobar3000.com/echo/echo.json | json2yaml | yaml2json

Installation
---

    npm install -g yaml2json
