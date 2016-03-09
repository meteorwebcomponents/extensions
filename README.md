# mwc:extensions

## Usage

`meteor add mwc:compiler`

Works with compiler versions above 1.1.41

Example compiler.mwc.json including extensions. 

mwc:extensions feeds vulcanized html content to the compileFunctions of each extension. If compileFunction is not explicitly defined package takes compileFunction as `MWC_my_package` if package name is `my:package`. 

compileFunction : datatype = Array or String

``` json

{
    "append": [
        "index.html"
    ],
    "import": [
        "bower_components/mwc-layout/mwc-layout.html",
        "bower_components/polymer/polymer.html",
        "bower_components/my-custom-element/my-custom-element.html"
    ],
    "extensions": {
        "mwc:ecmascript@1.0.10": {
            "compileFunction": "MWCEcmascript"
        },
        "my:custom-package@1.0.1": {
            "compileFunction": "my-custom-compile-function"
        }
    },
    "root": ".polymer"
}

```

