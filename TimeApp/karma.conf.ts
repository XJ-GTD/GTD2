// Karma configuration
// Generated on Thu Aug 08 2019 15:28:20 GMT+0800 (CST)

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // 加载插件清单
    plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('@angular/cli'),
        require('@angular-devkit/build-angular/plugins/karma')
    ],

    // list of files / patterns to load in the browser
    files: [
      { pattern: './src/test.ts', watched: false }
    ],

    // 指定请求文件MIME类型
    mime: {
        'text/x-typescript': ['ts', 'tsx']
    },

    // 指定angular cli环境
    angularCli: {
        environment: 'dev'
    },

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
}
