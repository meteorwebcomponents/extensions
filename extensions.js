var fs = Npm.require("fs");
MWCExtend = function(html,extensions){
extensions = extensions || {};
if(typeof(Package.mwc_ecmascript) !== 'undefined'){
 html = Package.mwc_ecmascript.MWCEcma.compile(html,extensions['ecmascript']);
}
fs.writeFile('.mwclogs/extensions.txt',JSON.stringify(Package));
return html;
}
