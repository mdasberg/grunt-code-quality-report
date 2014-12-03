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
            file: 'result.json',
            tmp: '.tmp/'
        });

        var jshint = this.data.results.jshint;
        var junit = this.data.results.junit;
        var e2e = this.data.results.e2e;
        var result = {};

        if (junit !== undefined) {
            result.junit = {};
            if (junit.results !== undefined) {
                var fileName;
                if (junit.results.file !== undefined) {
                    fileName = junit.results.file;
                } else if (junit.results.dir !== undefined) {
                    fileName = mergeTestResults(junit.results.dir);
                }
                if (fileName !== undefined) {
                    result.junit.tests = parseTestResults(fileName, junit.results.details);
                }
            }
            if (junit.coverage !== undefined) {
                if (junit.coverage.file !== undefined) {
                    result.junit.coverage = parseCoverageResults(junit.coverage.file);
                } else if (junit.coverage.dir !== undefined) {
                    result.junit.coverage = parseCoverageResults(junit.coverage.dir);
                }
            }
        }

        if (e2e !== undefined) {
            result.e2e = {};
            if (e2e.results !== undefined) {
                var fileName;
                if (e2e.results.file !== undefined) {
                    fileName = e2e.results.file;
                } else if (e2e.results.dir !== undefined) {
                    fileName = mergeTestResults(e2e.results.dir);
                }
                if (fileName !== undefined) {
                    result.e2e.tests = parseTestResults(fileName, e2e.results.details);
                }
            }
            if (e2e.coverage !== undefined) {
                if (e2e.coverage.file !== undefined) {
                    result.e2e.coverage = parseCoverageResults(e2e.coverage.file);
                } else if (e2e.coverage.dir !== undefined) {
                    result.e2e.coverage = parseCoverageResults(e2e.coverage.dir);
                }
            }
        }
        if (jshint !== undefined && jshint.file !== undefined) {
            result.jshint = parseJshintResults(jshint.file);
        } else {
            grunt.log.subhead('JsHint section undefined or file section missing');
        }

        var s = JSON.stringify(result);
        s = s.replace(/\\r\\n/g, "\\n"); // replace windows newline characters with \n
        grunt.file.write(options.dir + '/' + options.file, s);

        /**
         * Merge the test results and writes it in the tmp dir.
         * @param src The sources.
         * @param name The name that is used when writing to disk.
         */
        function mergeTestResults(src, name) {
            var result = '<?xml version="1.0"?><testsuites>';
            grunt.file.expand({ filter: 'isFile'}, src).forEach(function (file) {
                var content = grunt.file.read(file);
                var matches = /<testsuite [\s\S]*>[\s\S]*<\/testsuite>/g.exec(content);
                result = result.concat(matches);
            });
            result = result.concat('</testsuites>');
            var fileName = options.tmp + 'mergeResult-' + name + '.xml'
            grunt.file.write(fileName, result);
            return fileName;
        }

        /**
         * Parse the test results.
         * @param fileName The filename.
         * @returns parsedResults The parsed results
         */
        function parseTestResults(fileName, details) {
            var results = [];
            if (grunt.file.exists(fileName)) {
                xml2js.parseString(grunt.file.read(fileName), {}, function (err, res) {
                    res.testsuites.testsuite.forEach(function (testsuite) {

                        var failureDetails = [];

                        var result = {
                            browser: testsuite.$.name,
                            tests: Number(testsuite.$.tests),
                            failures: Number(testsuite.$.failures),
                            errors: Number(testsuite.$.errors),
                            time: Number(testsuite.$.time)
                        };

                        if (testsuite.testcase !== undefined) {
                            testsuite.testcase.forEach(function (testcase) {
                                var failure = {};
                                if (testcase.failure !== undefined) {
                                    if (details) {
                                        testcase.failure.forEach(function (failureCause) {
                                            failure.cause = failureCause._;
                                        });
                                    }
                                    failure.name = testcase.$.name;
                                    failureDetails.push(failure);
                                }
                            });
                        }

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
        function parseCoverageResults(src) {
            var collector = new istanbul.Collector();
            var utils = istanbul.utils;

            var results = [];
            grunt.file.expand({filter: 'isFile'}, src).forEach(function (file) {
                var browser = file.substring(0, file.lastIndexOf("/"));
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
    });
};
