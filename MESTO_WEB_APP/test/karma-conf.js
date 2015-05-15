module.exports = function(config){
    config.set({
    //  root path location that will be used to resolve all relative paths in files and exclude sections, should be the root of your project
    basePath : '../',
 
    // files to include, ordered by dependencies
    files : [
      // include relevant Angular files and libs
      'libs/angular.min.js',
      'libs/angular-mocks.js',
      'libs/angular-route.min.js',
 
      // include js files
      'js/mestoApp.js',
      'js/siteCTL.js',
      'js/roomCTL.js',
      'js/equipmentCTL.js',
      'js/loginCTL.js',
      'js/headerCTL.js',
      'js/mestoHelper.js',
      'js/userCTL.js',
      'js/userRoleCTL.js',
      'js/permissionCTL.js',
 
      // include unit test specs
      'test/unit/*.js'
    ],
    // files to exclude
    exclude : [
      /*'app/lib/angular/angular-loader.js'
      , 'app/lib/angular/*.min.js'
      , 'app/lib/angular/angular-scenario.js'*/
    ],
 
    // karma has its own autoWatch feature but Grunt watch can also do this
    autoWatch : false,
 
    // testing framework, be sure to install the karma plugin
    frameworks: ['jasmine'],
 
    // browsers to test against, be sure to install the correct karma browser launcher plugin
    //browsers : ['Chrome', 'IE', 'PhantomJS'],
    browsers : ['PhantomJS'],
 
    // progress is the default reporter
    //reporters: ['dots', 'progress', 'junit', 'growl', 'coverage'],
    reporters: ['progress', 'coverage'],
 
    // map of preprocessors that is used mostly for plugins
    preprocessors: {
        'js/*.js': 'coverage'
    },
    
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
 
    // list of karma plugins
    plugins : [
        'karma-coverage',
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-ie-launcher',
        'karma-phantomjs-launcher'
    ]
})}