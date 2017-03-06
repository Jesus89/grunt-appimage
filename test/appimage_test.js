'use strict';

var grunt = require('grunt');
var execSync = require('child_process').execSync;

function helloApp(test, appImage) {
  test.expect(1);

  var output = execSync('export SKIP=1; ' + appImage + ' world');
  test.ok(output.toString().includes('Hello, world!\n'));

  test.done();
}

exports.appimage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  helloApp1: function(test) {
    helloApp(test, 'tmp/Hello1.AppImage');
  },
  helloApp2: function(test) {
    helloApp(test, 'tmp/Hello2.AppImage');
  },
  helloApp3: function(test) {
    helloApp(test, 'tmp/Hello3.AppImage');
  },
  helloApp4: function(test) {
    helloApp(test, 'tmp/Hello4.AppImage');
  },
  helloApp5: function(test) {
    helloApp(test, 'tmp/Hello5.AppImage');
  }
};
