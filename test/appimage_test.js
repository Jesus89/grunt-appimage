'use strict';

var grunt = require('grunt');
var execSync = require('child_process').execSync;

exports.appimage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var output = execSync('tmp/MyApp.AppImage');
    test.equal(output.toString(), 'Hello, world!\n');

    test.done();
  }
};
