// Write your package code here!
//
MWCExtend = function(html){
if(typeof(Package.mwc_ecmascript) !== 'undefined'){
 html = Package.mwc_ecmascript.MWCEcma.compile(html);
}
return html;
}
