var path = Npm.require('path');
var fs = Npm.require('fs');
var mkdirp = Npm.require('mkdirp');
var echo = Npm.require('node-echo');
var beautify = Npm.require('js-beautify');

var extDir = path.resolve('./packages/mwc-extensions');
var packageJsPath = path.resolve(extDir, 'package.js');
var indexJsPath = path.resolve(extDir, 'extensions.js');


if(canProceed() && !fs.existsSync(extDir)) {
  console.log("=> Creating mwc extensions package");

  // create new mwc extensions directory
  mkdirp.sync(extDir);
  // add package files
  fs.writeFileSync(indexJsPath, getContent(_indexJsContent));
  fs.writeFileSync(packageJsPath, getContent(_packageJsContent));

  // add new container as a package
  var meteorPackages = fs.readFileSync(path.resolve('.meteor/packages'), 'utf8');
  if(!meteorPackages.match("mwc:extensions\n"))
    echo.sync("\nmwc:extensions", ">>", ".meteor/packages");

  console.log();
  console.log("-> mwc extensions support has been initialized.")
  console.log("-> please start your app again.");
  console.log();
  // if there is no mwc-extensions when running `meteor`
  // we need to kill the current running process, otherwise
  // mwc:extensions from the root meteor directory will be taken as default. ie the plugin
  //console.log(process.argv) 
    process.exit(0);


}

// check whether is this `meteor test-packages` or not
function canProceed() {
  var unAcceptableCommands = {'add':1,'test-packages': 1, 'publish': 1};
  if(process.argv.length > 2) {
    var command = process.argv[2];
    if(unAcceptableCommands[command]) {
      return false;
    }
  }

  return true;
}

function getContent(func) {
  var lines = func.toString().split('\n');
  // Drop the function declaration and closing bracket
  var onlyBody = lines.slice(1, lines.length -1);
  // Drop line number comments generated by Meteor, trim whitespace, make string
  onlyBody = _.map(onlyBody, function(line) {
    return line.slice(0, line.lastIndexOf("//")).trim();
  }).join('\n');
  // Make it look normal
  return beautify(onlyBody, { indent_size: 2 });
}

function _indexJsContent() {


  var fs = Npm.require("fs"),
    mkdirp = Npm.require('mkdirp'),
    path = Npm.require('path'),
    echo = Npm.require('node-echo');

  function packageExists(packageName) {
    var meteorPackages = fs.readFileSync(path.resolve('.meteor/packages'), 'utf8');
    return !!meteorPackages.match(packageName + "\n");
  }

  MWCExtend = function(html, extObj) {
    extObj = extObj || {};
    if (extObj.log) {
      var d = new Date();
      var n = d.toTimeString();
      if (!extObj.logFile) {
        var dir = ".mwclogs"
        mkdirp.sync(dir);
        extObj.logFile = dir + "/extensions.txt";
      }

      fs.writeFile(extObj.logFile, "packages\n" + JSON.stringify(Package));
    }
    var extensions = _.omit(extObj, ['log', "logFile"]);

    _.each(extensions, function(ext, name) {
      var packageName = name.split('@')[0];


      if (!packageName)
        return html;

      var packageObject = Package[packageName];

      if (!packageObject) {
        console.warn(packageName + " could not be found in Package object.");
        return html;
      }
      if (_.isEmpty(packageObject)) {
        console.warn(packageName + " is an empty object. Export the compile function");
        return html;
      }
      var compileFn = _.isEmpty(ext["compileFunction"]) ? 'MWC_' + packageName.replace(':', '_') : ext["compileFunction"];
      if (_.isString(compileFn)) {

        html = doCompile(packageObject, compileFn, html, ext, packageName);
      } else if (_.isArray(compileFn)) {
        _.each(compileFn, function(comp) {
          html = doCompile(packageObject, comp, html, ext, packageName);
        });
      }
    })

    return html;
  };

  function doCompile(packageObject, compileFn, html, ext, packageName) {
    if (!packageObject[compileFn]) {
      console.warn(packageName + " does not have " + compileFn + " object exported ");
      return html;
    } else {
      try{ 
        return packageObject[compileFn](html, ext);
      }
      catch(err){
        console.warn(packageName + "   " + compileFn +"has errors\n"+err.message);
        return html; 
      }
    }
  };
}



function _packageJsContent () {

  var fs = Npm.require('fs');
  var path = Npm.require('path');
  var _ = Npm.require('underscore');
  Package.describe({
    name: "mwc:extensions",
    version: "1.0.11",
    summary: "MWC compiler extensions",
    git: "https://github.com/meteorwebcomponents/extensions.git",
    documentation: "README.md"
  });


  function deps(api) {

    api.use("underscore", "server");

    var mwcFilePath = path.resolve('client/compiler.mwc.json');
    if(mwcFilePath){
      var mwcFile = JSON.parse(fs.readFileSync(mwcFilePath, 'utf8'));
      var extensions = _.keys(_.omit(mwcFile.extensions, ['log', "logFile"]));
      extensions.forEach(function(ext){
        api.use(ext, "server");
      });
    }
  }
  Package.onUse(function(api) {
    deps(api);
    api.addFiles("extensions.js", ["server"]);
    api.export('MWCExtend');
    api.versionsFrom("1.0");
  });

  Npm.depends({
    "mkdirp": "0.5.1",
    'node-echo': '0.1.1'
  });

}
