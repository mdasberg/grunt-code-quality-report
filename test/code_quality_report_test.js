'use strict';

var grunt = require('grunt');

exports.code_quality_report = {
    setUp: function (done) {
        done();
    },
    default: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/results/result.json');
        var expected = grunt.file.read('test/expected/example.json');
        test.equal(actual, expected, 'should write the result in the default result dir.');

        test.done();
    },
    override: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/override/results/override-file.json');
        var expected = grunt.file.read('test/expected/example.json');
        test.equal(actual, expected, 'should write the result in the override result dir.');

        test.done();
    },
    missing: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/missing/results/missing-file.json');
        var expected = grunt.file.read('test/expected/example-missing.json');
        test.equal(actual, expected, 'should write the result in the override result dir.');

        test.done();
    }
};
