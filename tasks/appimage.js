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
      dest: 'dist'
    });
    var data = {
      bin: this.data.bin,
      src: path.resolve(this.data.src),
      output: path.basename(this.data.src) + '.AppImage',
      binPath: path.join(this.data.src, this.data.bin)
    };

    // Check OS GNU/Linux
    if (process.platform !== 'linux') {
      grunt.fail.warn('This plugin runs only on GNU/Linux systems');
    }

    // Validate input data
    // - App directory exists
    // - App binary exists
    if (!grunt.file.isDir(data.src) || !grunt.file.isFile(data.binPath)) {
      grunt.fail.warn('Invalid input data');
    }

    var _tmp = new tmp.Dir();
    var tmpDir = _tmp.path;
    var tmpAppDir = path.join(tmpDir, 'MyApp.AppDir');
    var tmpAppRun = path.join(tmpAppDir, 'AppRun');
    var tmpUsrDir = path.join(tmpAppDir, 'usr');
    var tmpBinDir = path.join(tmpUsrDir, 'bin');
    var tmpAppSfs = path.join(tmpDir, 'MyApp.squashfs');
    var tmpAppImage = path.join(tmpDir, 'MyApp.AppImage');
    var localAppRun = path.join(__dirname, '..', 'bin', 'AppRun');
    var localAppImage64 = path.join(__dirname, '..', 'bin', 'MyApp.AppImage.64');
    var finalAppImage = path.join(options.dest, data.output);

    // Create temporary MyApp.AppDir directories
    fse.mkdirsSync(tmpBinDir);

    // Copy AppRun script to the temporary MyApp.AppDir directory
    fse.copySync(localAppRun, tmpAppRun);

    // Add App bin name to temporary AppRun script
    execSync('sed -i "s/%bin%/' + data.bin + '/g" ' + tmpAppRun);

    // Make temporary AppRun executable
    fse.chmodSync(tmpAppRun, '755');

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
