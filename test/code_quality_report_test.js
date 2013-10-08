'use strict';

var grunt = require('grunt');

exports.code_quality_report = {
    setUp: function (done) {
        done();
    },
    example: function (test) {
        test.expect(1);

        var actual = grunt.file.read('result.json');
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
    }
};
