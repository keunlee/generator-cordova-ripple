[![Build Status](https://travis-ci.org/keunlee/generator-cordova-ripple.svg?branch=master)](https://travis-ci.org/keunlee/generator-cordova-ripple)

# generator-cordova-ripple
A Yeoman Generator for creating a Cordova Application Skeleton which runs in the Ripple Emulator

## Overview
This generator creates a skeleton Cordova project for you to build upon afterwards. It does the following: 

1. Starts the Ripple Emulator in a browser and will begin watching your CSS and JS, and rebuild every time you save a change. It will auto refresh the ripple emulator's viewport too.
2. Adds a cordova "browser" platform for you to test your mobile apps in a web browser. It does not replace development on an actual device for testing or debugging. Nothing replaces that. 
3. Dynamically wires javascript dependencies to your index.html file when adding javascript libraries through bower. 
4. Creates a Cordova friendly project

## Requirements

### Pre-prerequisites
Install these if you do not have them

1. Node.JS
2. Ruby
3. Python 2.7

If you're not sure if they're installed, run these commands from the command line/terminal:

1. `node -v`
2. `ruby -v`
3. `python --version`

These commands should be available globally in the command line/terminal. 

### Prerequisites
1. Compass: `gem install compass`
2. Grunt: `npm install -g grunt-cli`
3. Bower: `npm install -g bower`
4. Yeoman: `npm install -g yo`
5. Cordova: `npm install -g cordova`
6. Ripple Emulator: `npm install -g ripple-emulator`

For various platform environments such as Android and iOS, you'll want to install the respective SDKs and Cordova Platform Plugins. For more info, see https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides

## Installation
1. Install the generator: `npm install -g generator-cordova-ripple`
2. Create a working directory and navigate into it:
    1. `mkdir my-cordova-ripple-project`
    2. `cd my-cordova-ripple-project`
3. Run the generator to generate project files: `yo cordova-ripple`

## Usage

### Running the Emulator
Make sure you are in the root of your working directory and run the following from the command line:  

`grunt`

### Installing Additional Javascript Libraries
To install javascript libraries you'd like to use in your project, you can use bower. i.e.:

`bower install jquery --save`

This will install your library and update your index.html file to reflect the new library reference

### Development

1. All developments for your project should be contained within the "www" folder, which is created after running this generator.
2. Sass development for this generator has been configured to reference the .scss file located at `www/styles/main.scss`. 
    1. When you update this file, another file, `main.css` will be created/updated, which is currently referenced by the application.
    2. To reference sass files from with in the `main.scss`, do so by doing the following: 
        1. create another scss file prefixed with an underscore (i.e. _reference.scss). The underscore tells compass to ignore that file when processing. 
        2. add an import statement in `main.scss`, i.e. `@import "reference"`, without the underscore and without the extension. 
        3. when your sass files are compiled, you should see the file `main.css` updated to reflect all changes between `main.scss` and imported sass files. 
3. When running your generated application for other platforms (i.e. android, iOS), besides the 'browser' platform, make sure to run the following to update the files for the platform you wish to run against: 

`grunt build`

4. Additional Notes
    1. Before running the above, the assumption here is that you have already added a platform to your project i.e. `cordova platform add ios`.
    2. If you're not running the server, and you want to update a platform, you can still run the above command `grunt build`.

## Useful References

1. Cordova Documentation: https://cordova.apache.org/docs/en/4.0.0/index.html


