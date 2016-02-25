var fs = Npm.require("fs");
MWCExtend = function(html,extensions){
  extensions = extensions || {};
  if(typeof(Package.mwc_ecmascript) !== 'undefined'){
    html = Package.mwc_ecmascript.MWCEcma.compile(html,extensions['ecmascript']);
  }
  if(extensions.log){
    var d = new Date();
    var n = d.toTimeString();
    if(!extensions.logFile){
      var dir = ".mwclogs"
      mkdirp.sync(dir);
      extensions.logFile =  dir+"/ecmascript.txt";
    }

    fs.writeFile(extensions.logFile,JSON.stringify(Package));
  }
  return html;
}
