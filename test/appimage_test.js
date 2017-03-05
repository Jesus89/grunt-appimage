'use strict';

var grunt = require('grunt');
var execSync = require('child_process').execSync;

exports.appimage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  helloApp: function(test) {
    test.expect(1);

    var output = execSync('export SKIP=1; tmp/HelloApp.AppImage world');
    test.ok(output.toString().includes('Hello, world!\n'));

    test.done();
  }
};
