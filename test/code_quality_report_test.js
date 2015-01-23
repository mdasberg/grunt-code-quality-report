'use strict';

var grunt = require('grunt');

exports.code_quality_report = {
    setUp: function (done) {
        done();
    },
    default: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/results/result.json');
        var expected = grunt.file.read('test/expected/default.json');
        test.equal(actual, expected, 'should write the result in the default result dir.');

        test.done();
    },
    defaultWithMultipleTestFiles: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/defaultWithMultipleTestFiles/results/default-file.json');
        var expected = grunt.file.read('test/expected/defaultWithMultipleTestFiles.json');
        test.equal(actual, expected, 'should write the result in the missing result dir.');

        test.done();
    },
    defaultWithoutTestCases: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/defaultWithoutTestCases/results/default-file.json');
        var expected = grunt.file.read('test/expected/defaultWithoutTestCases.json');
        test.equal(actual, expected, 'should write the result in the default result dir.');

        test.done();
    },
    override: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/override/results/override-file.json');
        var expected = grunt.file.read('test/expected/override.json');
        test.equal(actual, expected, 'should write the result in the override result dir.');

        test.done();
    },
    overrideWithDetails: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/overrideWithDetails/results/override-file.json');
        var expected = grunt.file.read('test/expected/overrideWithDetails.json');
        test.equal(actual, expected, 'should write the result in the override result dir.');

        test.done();
    },
    missing: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/missing/results/missing-file.json');
        var expected = grunt.file.read('test/expected/missing.json');
        test.equal(actual, expected, 'should write the result in the missing result dir.');

        test.done();
    },
    missingFiles: function(test) {
        test.expect(1);
        //test.ok(!grunt.file.exists('.tmp/does/not/exist/non-existing-file.json'), 'Should not have created a file');
        var actual = grunt.file.read('.tmp/does/not/exist/non-existing-file.json');
        var expected = grunt.file.read('test/expected/missing.json');
        test.equal(actual, expected, 'should write the result in the missing result dir.');

        test.done();
    },
    undefined: function (test) {
        test.expect(1);

        var actual = grunt.file.read('.tmp/undefined/results/undefined-file.json');
        var expected = grunt.file.read('test/expected/undefined.json');
        test.equal(actual, expected, 'should write the result in the missing result dir.');

        test.done();
    }
};
