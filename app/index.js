'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cordova = require('cordova');
var ndfs = require('fs');
var exec = require('child_process').exec;

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

var CordovaRippleGenerator = module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the breathtaking' + chalk.red(' Cordova Ripple') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name ?',
      default: 'CordovaRippleApp'
    }, {
      name: 'appPackage',
      message: 'What is your app\'s package name ?',
      default: 'com.packagenamespace.app'
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      this.appName = props.appName;
      this.appPackage = props.appPackage;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );

      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );

      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );

      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
    },

    createCordovaApp: function() {
      cordova.create(process.cwd(), this.appPackage, this.appName);
    },

    installTemplateFilesAfterCordova: function() {

      ndfs.unlinkSync( this.destinationPath('www/index.html'));

      this.fs.copy(
        this.templatePath('_www/_index.html'),
        this.destinationPath('www/index.html')
      );

      this.fs.copy(
        this.templatePath('_www/_styles/_main.scss'),
        this.destinationPath('www/styles/main.scss')
      );

      if (!ndfs.existsSync(this.destinationPath('bower_components'))) {
        ndfs.mkdirSync(this.destinationPath('bower_components'));
      }

      exec('cordova platform add browser --usegit', function(error, stdout, stderr) {
        if (error !== null) {
          throw error;
        }
      });
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
