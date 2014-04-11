/*
 * grunt-code-quality-report
 * https://github.com/mdasberg/grunt-code-quality-report
 *
 * Copyright (c) 2013 Mischa Dasberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var xml2js = require('xml2js');
    var istanbul = require('istanbul');

    grunt.registerMultiTask('code_quality_report', 'Grunt code quality reporter', function () {
        var options = this.options({
            dir: '.',
            file: 'result.json'
        });

        var result = {
            junit: parseJunitAndE2EResults(this.data.results.junit.file, this.data.results.junit.showDetails),
            coverage: parseCoverageResults(this.data.results.coverage),
            jshint: parseJshintResults(this.data.results.jshint),
            e2e: parseJunitAndE2EResults(this.data.results.e2e.file, this.data.results.e2e.showDetails)
        };

        var s = JSON.stringify(result);
        s = s.replace(/\\r\\n/g, "\\n"); // replace windows newline characters with \n
        grunt.file.write(options.dir + '/' + options.file, s);
    });

    /**
     * Parse the junit or E2E results.
     * @param fileName The filename.
     * @returns {{junit: {}}} or {{E2E: {}}}
     */
    function parseJunitAndE2EResults(fileName, showDetails) {
        var results = [];
        if (grunt.file.exists(fileName)) {
            xml2js.parseString(grunt.file.read(fileName), {}, function (err, res) {
                res.testsuites.testsuite.forEach(function (testsuite) {

                    var failureDetails = [];

                    var result = {
                        browser: testsuite.$.name,
                        tests: Number(testsuite.$.tests),
                        failures: Number(testsuite.$.failures),
                        time: Number(testsuite.$.time),
                        errors: Number(testsuite.$.errors)
                    };


                    testsuite.testcase.forEach(function (testcase) {
                        var failures = [];
                        var failure = {};
                        if (testcase.failure !== undefined) {
                            if (showDetails) {
                                testcase.failure.forEach(function (failureCause) {
                                   failure.cause = failureCause._;
                                });
                            }
                            failure.name = testcase.$.name;
                            failureDetails.push(failure);
                        }
                    });

                    // Check if there are failures
                    if (Number(testsuite.$.failures) > 0) {
                        result.failureDetails = failureDetails;
                    }


                    results.push(result);
                });
            });
        }
        return results;
    }

    /**
     * Parse the coverage results
     * @param coverage The coverage location.
     * @returns {{coverage: {}}}
     */
    function parseCoverageResults(coverage) {
        var collector = new istanbul.Collector();
        var utils = istanbul.utils;

        var results = [];
        var coverageDir = coverage.substring(0, coverage.lastIndexOf("/"));
        grunt.file.expand(coverage).forEach(function (file) {
            var fileName = file.substr(coverageDir.length + 1, file.length);
            var browser = fileName.match(/^coverage-(.*\s.*\s\(.*\))-.*\.json$/)[1];

            collector.add(JSON.parse(grunt.file.read(file)));
            var summary = utils.summarizeCoverage(collector.getFinalCoverage());
            results.push({
                browser: browser,
                lines: Number(summary.lines.pct),
                branches: Number(summary.branches.pct),
                functions: Number(summary.functions.pct),
                statements: Number(summary.statements.pct)
            });
        });
        return results;
    }

    /**
     * Parse the jshint results.
     * @param fileName The filename.
     * @returns {{junit: {}}}
     */
    function parseJshintResults(fileName) {
        var result = {};
        if (grunt.file.exists(fileName)) {
            var content = grunt.file.read(fileName);
            xml2js.parseString(content, {}, function (err, res) {
                var consoleStatements = content.match(/(console.*)/g);
                result = {
                    tests: Number(res.testsuite.$.tests),
                    failures: Number(res.testsuite.$.failures),
                    errors: Number(res.testsuite.$.errors),
                    consoleStatements: consoleStatements != null ? consoleStatements.length : 0
                };
            });
        }
        return result;
    }
};
