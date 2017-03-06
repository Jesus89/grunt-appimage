/*
 * grunt-appimage
 *
 * Copyright (c) 2017 Jesús Arroyo Torrens
 * Licensed under the GPL-2.0 license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    appimage: {
      hello1: {
        options: {
          name: 'HelloApp1',
          exec: 'hello',
          archive: 'tmp/Hello1.AppImage'
        },
        files: [{
          src: 'test/HelloApp/hello'
        }]
      },
      hello2: {
        options: {
          name: 'HelloApp2',
          exec: 'newdir/hello',
          archive: 'tmp/Hello2.AppImage'
        },
        files: [{
          src: 'test/HelloApp/*',
          dest: 'newdir/'
        }]
      },
      hello3: {
        options: {
          name: 'HelloApp3',
          exec: 'test/HelloApp/hello',
          archive: 'tmp/Hello3.AppImage'
        },
        files: [{
          expand: true,
          src: 'test/HelloApp/*'
        }]
      },
      hello4: {
        options: {
          name: 'HelloApp4',
          exec: 'newdir/test/HelloApp/hello',
          archive: 'tmp/Hello4.AppImage'
        },
        expand: true,
        src: 'test/HelloApp/*',
        dest: 'newdir'
      },
      hello5: {
        options: {
          name: 'HelloApp5',
          exec: 'hello',
          archive: 'tmp/Hello5.AppImage'
        },
        files: [{
          expand: true,
          cwd: 'test/HelloApp',
          src: ['*']
        }]
      },
      notify: {
        options: {
          name: 'NotifyApp',
          exec: 'notify',
          arch: '64bit',
          icons: 'res/icons',
          comment: 'Launch a system notification',
          archive: 'tmp/NotifyApp.AppImage'
        },
        src: 'test/NotifyApp/*'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'appimage', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
