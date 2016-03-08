var fs = Npm.require('fs');
var path = Npm.require('path');
var _ = Npm.require('underscore');
Package.describe({
  name: "mwc:extensions",
  version: "1.0.22",
  summary: "MWC compiler extensions",
  git: "https://github.com/meteorwebcomponents/extensions.git",
  documentation: "README.md"
});

Package.on_use(function(api) {
  api.use("underscore@1.0.4", "server");
  api.use("isobuild:compiler-plugin@1.0.0");
  api.addFiles("extensions.js", ["server"]);
  api.export("MWCExtend");
  api.versionsFrom("1.0");
});

Npm.depends({
  "mkdirp": "0.5.1",
  'node-echo': '0.1.1'
});


