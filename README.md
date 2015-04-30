# generator-cordova-ripple
A Yeoman Generator for creating a Cordova Application Skeleton which runs in the Ripple Emulator

## overview
This generator creates a skeleton Cordova project for you to build upon afterwards. It does the following: 

1. Starts the Ripple Emulator in a browser and will begin watching your CSS and JS, and rebuild every time you save a change. It will auto refresh the ripple emulator's viewport too.
2. Adds a cordova "browser" platform for you to test your mobile apps in a web browser. It does not replace development on an actual device for testing or debugging. Nothing replaces that. 
3. Dynamically wires javascript dependencies to your index.html file when adding javascript libraries through bower. 
4. Creates a Cordova friendly project

## requirements

### pre-prerequisites
Install these if you do not have them

1. Node.JS
2. Ruby

If you're not sure if they're installed, run these commands from the command line/terminal:

1. `node -v`
2. `ruby -v`

These commands should be available globally in the command line/terminal. 

### prerequisites
1. Compass: `gem install compass`
2. Grunt: `npm install -g grunt-cli`
3. Bower: `npm install -g bower`
4. Yeoman: `npm install -g yo`
5. Cordova: `npm install -g cordova`

For various platform environments such as Android and iOS, you'll want to install the respective SDKs and Cordova Platform Plugins. For more info, see https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides

## installation
1. Install the generator: `npm install -g generator-cordova-ripple`
2. Create a working directory and navigate into it:
    1. `mkdir my-cordova-ripple-project`
    2. `cd my-cordova-ripple-project`
3. Run the generator to generate project files: `yo cordova-ripple`

## usage

### Running the Emulator
Make sure you are in the root of your working directory and run the following from the command line:  

`grunt`

### Installing Additional Javascript Libraries
To install javascript libraries you'd like to use in your project, you can use bower. i.e.:

`bower install jquery --save`

This will install your library and update your index.html file to reflect the new library reference

### Development

1. All developments for your project should be contained within the "www" folder, which is created after running this generator.
2. Sass development for this generator has been configured to reference the .scss file located at `www/styles/main.scss`. When you update this file, another file, `main.css` will be created/updated, which is currently referenced by the application.
3. When running your generated application for other platforms (i.e. android, iOS), besides the 'browser' platform, make sure to run the following to update the files for the platform you wish to run against: 
    1. `grunt build`
    2. `cordova prepare`

Note: Before running the above, the assumption here is that you have already added a platform to your project i.e. `cordova platform add ios`.

## Useful References

1. Cordova Documentation: https://cordova.apache.org/docs/en/4.0.0/index.html


