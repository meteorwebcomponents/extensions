Package.describe({
  name: 'mwc:extensions',
  version: '1.0.4',
  summary: 'MWC compiler extensions',
  git: "https://github.com/meteorwebcomponents/extensions.git",
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('mwc:ecmascript@1.0.4','server',{weak:true});
  api.use('underscore',['server']);
  api.versionsFrom('1.0');
  api.addFiles(['extensions.js'],'server');
  api.export('MWCExtend','server');
});


