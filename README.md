# mwc:extensions

## Usage

`meteor add mwc:compiler`

`meteor add mwc:extensions` .its important to add extensions after adding compiler

compiler.mwc.json for extensions. 

mwc:extensions feeds vulcanized html content to the compileFunctions of each extension. If compileFunction is not explicitly defined package takes compileFunction as `MWC_my_package` if package name is my:package.

```json

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
        "mwc:ecmascript@1.0.6": {
            "compileFunction": "MWCEcmascript"
        },
        "my:custom-package@1.0.1": {
            "compileFunction": "my-custom-compile-function"
        }
    },
    "root": ".polymer"
}

```
