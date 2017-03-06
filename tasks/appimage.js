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
      name: null,
      exec: null,
      arch: '64bit',
      comment: '',
      archive: null
    });

    // Check OS GNU/Linux
    if (process.platform !== 'linux') {
      grunt.log.warn('This plugin runs only on GNU/Linux systems');
      return;
    }

    // Check name
    if (typeof options.name !== 'string' || options.name.length === 0) {
      grunt.fail.warn('Unable to package: no valid application name was specified');
    }

    // Check exec path
    if (typeof options.exec !== 'string' || options.exec.length === 0) {
      grunt.fail.warn('Unable to package: no valid exec path was specified');
    }

    // Check archive
    if (typeof options.archive === 'function') {
      options.archive = options.archive();
    }
    if (typeof options.archive !== 'string' || options.archive.length === 0) {
      grunt.fail.warn('Unable to package: no valid archive file was specified');
    }

    // Check arch
    if (options.arch !== '32bit' && options.arch !== '64bit') {
      grunt.log.warn('Invalid architecture (' + options.arch + '). Using default: 64bit');
      options.arch = '64bit';
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
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    // Create temporary MyApp.AppDir directories
    fse.mkdirsSync(tmpBinDir);

    // Copy
    this.files.forEach(function(file) {
      var expand = file.orig.expand || false;
      file.src.forEach(function(src) {
        // Validate src data
        if (!grunt.file.exists(src)) {
          grunt.fail.warn('Invalid src (' + src + ')');
        }
        // Copy src file to the MyApp.AppDir/usr/bin directory
        var destPath = expand ? file.dest : path.join(file.dest || '', path.basename(src));
        if (grunt.file.isFile(src)) {
          fse.copySync(src, path.join(tmpBinDir, destPath));
        }
      });
    });

    // Validate executable
    if (!grunt.file.isFile(path.join(tmpBinDir, options.exec))) {
      grunt.fail.warn('Executable not found (' + options.exec + ')');
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
    execSync('sed -i "s/<%= uuid %>/' + uuid + '/g" ' + tmpDesktop);

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
    fse.removeSync(tmpDir);

    grunt.log.writeln('File "' + finalAppImage + '" created.');

  });

};
