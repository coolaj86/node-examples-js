form-serializer
===

    ender add form-serializer

    var serializeForm = require('form-serializer').serializeFormObject
      , obj
      ;

    obj = serializeForm('form#save-data');

    console.log(obj);

API
===

  * serializeFormObject
    * does not allow duplicate keys - `[name=foobar]`
    * does turn `[name="waldo[]"]` into an array

              {
                  "foobar": "baz"
                , "grault": "garply"
                , "waldo": ["qux", "quux"]
              }

  * serializeFormArray
    * true representation of the form

              [
                  {
                      "name": "foobar"
                    , "value": "baz"
                  }
                , {
                      "name": "waldo[]"
                    , "value": "qux"
                  }
              ]

License
===

Copyright AJ ONeal 2011

This project is available under the MIT and Apache v2 licenses.

  * http://www.opensource.org/licenses/mit-license.php
  * http://www.apache.org/licenses/LICENSE-2.0.html
