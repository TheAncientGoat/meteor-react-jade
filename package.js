Package.describe({
  name: 'ryanswrt:jade-react',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Compile Jade files for use in React elements',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/TheAncientGoat/meteor-react-jade',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'

});

Package.registerBuildPlugin({
    name: "compileTemplatesBatch",
    // minifiers is a weak dependency of spacebars-compiler; adding it here
    // ensures that the output is minified.  (Having it as a weak dependency means
    // that we don't ship uglify etc with built apps just because
    // boilerplate-generator uses spacebars-compiler.)
    // XXX maybe uglify should be applied by this plugin instead of via magic
    // weak dependency.
    use: [
        'caching-compiler@1.0.0',
        'ecmascript',
        //'templating-tools@',
        //'jade-react-compiler'
    ],
    npmDependencies:{
        'react-jade':'2.5.0'
    },
    sources: [
        'plugin/compile-templates.js'
    ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.addFiles('jade-react.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ryanswrt:jade-react');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.addFiles('jade-react-tests.js');
});
