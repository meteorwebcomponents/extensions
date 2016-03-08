var fs = Npm.require("fs"),
  mkdirp = Npm.require('mkdirp'),
  path = Npm.require('path'),
  echo = Npm.require('node-echo');

function packageExists(packageName) {
  var meteorPackages = fs.readFileSync(path.resolve('.meteor/packages'), 'utf8');
  return !!meteorPackages.match(packageName + "\n");
}
function addPackage(packageName){
  echo.sync("\n"+packageName+"\n", ">>", ".meteor/packages");
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
      if(!packageExists(packageName)){
        addPackage(packageName);
      }
      return html;
    }
    if (_.isEmpty(packageObject)) {
      console.warn(packageName + " is an empty object. Export the compile function");
      return html;
    }
    var compileFn = _.isEmpty(ext["compileFunction"]) ? 'MWC_' + packageName.replace(':', '_') : ext["compileFunction"]
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
    try {
      return packageObject[compileFn](html, ext);
    } catch (err) {
      console.warn(packageName + "   " + compileFn + "has errors\n" + err.message);
      return html;
    }
  }
};
