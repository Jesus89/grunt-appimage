/*
 * grunt-appimage
 *
 * Copyright (c) 2017 Jesús Arroyo Torrens
 * Licensed under the GPL-2.0 license.
 */

'use strict';
var path = require('path');
var fse = require('fs-extra');
var tmp = require('temporary');
var execSync = require('child_process').execSync;

module.exports = function(grunt) {

  grunt.registerMultiTask('appimage', 'Grunt task to create AppImages.', function() {
    // Merge task-specific and/or target-specific options with these defaults
    var options = this.options({
      name: 'MyApp',
      comment: 'MyApp',
      exec: 'myapp',
      dest: 'dist'
    });
    var data = {
      src: path.resolve(this.data.src),
      output: options.name + '.AppImage',
      execPath: path.join(this.data.src, options.exec)
    };

    // Check OS GNU/Linux
    if (process.platform !== 'linux') {
      grunt.fail.warn('This plugin runs only on GNU/Linux systems');
    }

    // Validate input data
    // - App directory exists
    // - App binary exists
    if (!grunt.file.isDir(data.src) || !grunt.file.isFile(data.execPath)) {
      grunt.fail.warn('Invalid input data');
    }

    var _tmp = new tmp.Dir();
    var tmpDir = _tmp.path;
    var tmpAppDir = path.join(tmpDir, 'MyApp.AppDir');
    var tmpAppRun = path.join(tmpAppDir, 'AppRun');
    var tmpDesktop = path.join(tmpAppDir, options.exec + '.desktop');
    var tmpUsrDir = path.join(tmpAppDir, 'usr');
    var tmpBinDir = path.join(tmpUsrDir, 'bin');
    var tmpShareDir = path.join(tmpUsrDir, 'share');
    var tmpIconsDir = path.join(tmpShareDir, 'icons');
    var tmpAppSfs = path.join(tmpDir, 'MyApp.squashfs');
    var tmpAppImage = path.join(tmpDir, 'MyApp.AppImage');
    var localAppRun = path.join(__dirname, '..', 'res', 'AppRun');
    var localDesktop = path.join(__dirname, '..', 'res', 'desktop.tpl');
    var localAppImage64 = path.join(__dirname, '..', 'res', 'MyApp.AppImage.64');
    var finalAppImage = path.join(options.dest, data.output);
    var iconsPath = options.icons;

    // Create temporary MyApp.AppDir directories
    fse.mkdirsSync(tmpBinDir);

    // Copy AppRun script to the temporary MyApp.AppDir directory
    fse.copySync(localAppRun, tmpAppRun);

    // Make temporary AppRun executable
    fse.chmodSync(tmpAppRun, '755');

    // Copy Desktop file to the temporary MyApp.AppDir directory
    fse.copySync(localDesktop, tmpDesktop);

    // Add Desktop data in the temporary desktop file
    execSync('sed -i "s/<%= name %>/' + options.name + '/g" ' + tmpDesktop);
    execSync('sed -i "s/<%= comment %>/' + options.comment + '/g" ' + tmpDesktop);

    // Copy icons to the MyApp.AppDir/usr/share/icons directory
    if (iconsPath) {
      fse.copySync(iconsPath, tmpIconsDir);
    }

    // Copy default AppImage (contains the runtime) to the temporary directory
    fse.copySync(localAppImage64, tmpAppImage);

    // Copy recursive the App directory to the MyApp.AppDir/usr/bin directory
    fse.copySync(data.src, tmpBinDir);

    // Create MyApp.AppImage
    execSync('mksquashfs ' + tmpAppDir + ' ' + tmpAppSfs + ' -root-owned -noappend');
    execSync('cat ' + tmpAppSfs + ' >> ' + tmpAppImage);

    // Copy AppImage to dest directory
    fse.copySync(tmpAppImage, finalAppImage);

    // Make AppImage executable
    fse.chmodSync(finalAppImage, '755');

    // Remove the temporary directory
    fse.removeSync(tmpDir);

    grunt.log.writeln('File "' + data.output + '" created.');

  });

};
