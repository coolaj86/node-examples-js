form-serializer
===

    ender add form-serializer

    var serializeForm = require('form-serializer').serializeFormObject
      , toNativeTypes = true
      , obj
      ;

    obj = serializeForm('form#save-data', toNativeTypes);
    // `true` means "try to convert to native types"
    // Supported Types: Numbers, Boolean, and null

    console.log(obj);

API
===

Okay, so `serialize` is a terrible prefix. jQuery talked fancy to me. I got confused!

`serialize`ing a form, in this case, means to go from DoM to JavaScript, not from Object to Text.

An optional second parameter will cause the values to be typecasted.
Supported Types: `Numbers`, `Boolean`, and `null`.

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
