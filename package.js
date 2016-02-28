Package.describe({
  name: "mwc:extensions",
  version: "1.0.11",
  summary: "MWC compiler extensions",
  git: "https://github.com/meteorwebcomponents/extensions.git",
  documentation: "README.md"
});


Package.registerBuildPlugin({
  name: "initializing-extensions",
  use: [
    'underscore@1.0.4'
  ],
  sources: [
    'plugin/extensions.js'
  ],
  npmDependencies: {
    'mkdirp': '0.5.0',
    'node-echo': '0.1.1',
    'js-beautify': '1.5.5'
  }
});

Package.on_use(function(api) {
});

