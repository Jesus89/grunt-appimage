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
      exec: 'myapp',
      arch: '64bit',
      comment: 'MyApp',
      archive: null
    });

    // Check OS GNU/Linux
    if (process.platform !== 'linux') {
      grunt.log.warn('This plugin runs only on GNU/Linux systems');
      return;
    }

    // Check arch
    if (options.arch !== '32bit' && options.arch !== '64bit') {
      grunt.log.warn('Invalid architecture (' + options.arch + '). Using default: 64bit');
      options.arch = '64bit';
    }

    // Check archive
    if (typeof options.archive === 'function') {
      options.archive = options.archive();
    }
    if (typeof options.archive !== 'string' || options.archive.length === 0) {
      grunt.fail.warn('Unable to package: no valid archive file was specified');
    }

    var _tmp = new tmp.Dir();
    var tmpDir = _tmp.path;
    var tmpAppDir = path.join(tmpDir, 'MyApp.AppDir');
    var tmpAppRun = path.join(tmpAppDir, 'AppRun');
    var tmpDesktop = path.join(tmpAppDir, options.name + '.desktop');
    var tmpUsrDir = path.join(tmpAppDir, 'usr');
    var tmpBinDir = path.join(tmpUsrDir, 'bin');
    var tmpShareDir = path.join(tmpUsrDir, 'share');
    var tmpIconsDir = path.join(tmpShareDir, 'icons');
    var tmpAppSfs = path.join(tmpDir, 'MyApp.squashfs');
    var tmpAppImage = path.join(tmpDir, 'MyApp.AppImage');
    var localResDir = path.join(__dirname, '..', 'res');
    var localAppRun = path.join(localResDir, 'AppRun');
    var localDesktop = path.join(localResDir, 'desktop.tpl');
    var localAppImage = path.join(localResDir, 'AppImage.' + options.arch);
    var finalAppImage = options.archive;
    var iconsPath = options.icons;

    // Create temporary MyApp.AppDir directories
    fse.mkdirsSync(tmpBinDir);

    // Copy
    this.files.forEach(function(file) {
      file.src.forEach(function(src) {
        // Validate src data
        if (!grunt.file.exists(src) && (!grunt.file.isFile(src) || !grunt.file.isDirectory(src))) {
          grunt.fail.warn('Invalid src (' + src + ')');
        }
        // Copy recursive the App directory to the MyApp.AppDir/usr/bin directory
        fse.copySync(src, path.join(tmpBinDir, file.dest || ''));
      });
    });

    // Validate executable
    if (!grunt.file.isFile(path.join(tmpBinDir, options.exec))) {
      grunt.fail.warn('Invalid executable (' + options.exec + ')');
    }

    // Copy AppRun script to the temporary MyApp.AppDir directory
    fse.copySync(localAppRun, tmpAppRun);

    // Add application data in the temporary desktop file
    execSync('sed -i "s/<%= name %>/' + options.name + '/g" ' + tmpAppRun);
    execSync('sed -i "s/<%= app %>/' + options.exec.replace(/\//g, '\\/') + '/g" ' + tmpAppRun);

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
    fse.copySync(localAppImage, tmpAppImage);

    // Create MyApp.AppImage
    execSync('mksquashfs ' + tmpAppDir + ' ' + tmpAppSfs + ' -root-owned -noappend');
    execSync('cat ' + tmpAppSfs + ' >> ' + tmpAppImage);

    // Copy AppImage to dest directory
    fse.copySync(tmpAppImage, finalAppImage);

    // Make AppImage executable
    fse.chmodSync(finalAppImage, '755');

    // Remove the temporary directory
    //fse.removeSync(tmpDir);
    console.log(tmpDir);

    grunt.log.writeln('File "' + finalAppImage + '" created.');

  });

};
