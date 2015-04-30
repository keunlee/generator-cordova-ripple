/*jshint camelcase: false */
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'www',
    dist: 'dist',
    cordova_script_snippet: '<script type="text/javascript" src="platforms/browser/www/cordova.js"></script>'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer', 'copy:platform']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          middleware: function (connect, options, middlewares) {

            var injectCordovaScriptMiddleware = function (req, res, next) {

              var snap = function(body, snippet ) {
                var _body = body;
                rules.some(function(rule) {
                  if (rule.match.test(body)) {
                    _body = body.replace(rule.match, function(w) {
                      return rule.fn(w, snippet);
                    });
                    return true;
                  }
                  return false;
                });
                return _body;
              };

              var prepend = function(w, s) {
                return s + w;
              };

              var append = function(w, s) {
                return w + s;
              };

              var restore = function() {
                res.write = write;
              };

              var isHtml = function(str) {
                if (!str) {
                  return false;
                } else {
                  return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
                }
              };

              var opt = opt || {};
              var rules = opt.rules || [{
                  match: /<\/body>/,
                  fn: prepend
                }, {
                  match: /<\/html>/,
                  fn: prepend
                }, {
                  match: /<\!DOCTYPE.+>/,
                  fn: append
                }];
              var write = res.write;

              res.write = function (string, encoding) {

                if ( string && isHtml(string)) {
                  try {
                    var body = string instanceof Buffer ? string.toString(encoding) : string;
                    body = snap( body, appConfig.cordova_script_snippet );
                    restore();
                    return write.call(res, body, encoding);
                  } catch (error) {
                    restore();
                    return write.call(res, string, encoding);
                  }
                } else {
                  restore();
                  return write.call(res, string, encoding);
                }
              };

              return next();
            };

            var setCORS = function(req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              return next();
            };

            middlewares.unshift( connect.static('.tmp') );
            middlewares.unshift( connect().use('/bower_components',connect.static('./bower_components')) );
            middlewares.unshift( connect().use('/platforms',connect.static('./platforms')) );
            middlewares.unshift( connect().use('/img',connect.static('./www/img')) );
            middlewares.unshift( connect.static(appConfig.app) );
            middlewares.unshift( injectCordovaScriptMiddleware );
            middlewares.unshift( setCORS );

            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= config.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= config.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/{,*/}*',
            '!<%= config.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= config.app %>/index.html'],
        ignorePath:  /\.\.\//,
        cwd: './'
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= config.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/scripts',
        fontsDir: '<%= config.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= config.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      platform: {
        expand: true,
        cwd: '.tmp/styles/',
        dest: '<%= config.app %>/styles',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ],
      concurrent_serve: [
        'serve',
        'run:ripple'
      ],
      concurrent_ripple: {
        tasks: [
          'run:ripple'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      watch_ripple: {
        tasks: [
          'watch',
          'run:ripple'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    run: {
      ripple: {
        cmd: 'ripple',
        args: [
          'emulate',
          '--remote',
          'http://localhost:9000'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('serve', 'Compile then connect a web server', function (target) {
    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'concurrent:watch_ripple'
    ]);
  });

  grunt.registerTask('default', [
    'serve'
  ]);

  grunt.registerTask('build', [
    'compass:server',
    'copy:platform'
  ]);
};
