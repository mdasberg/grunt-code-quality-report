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
            junit: parseJunitResults(this.data.results.junit, this.options({dir: '.'})),
            coverage: parseCoverageResults(this.data.results.coverage),
            jshint: parseJshintResults(this.data.results.jshint),
            e2e: parseE2eResults(this.data.results.e2e)
        };

        grunt.file.write(options.dir + '/' + options.file, JSON.stringify(result));
    });

    /**
     * Parse the junit results.
     * @param fileName The filename.
     * @returns {{junit: {}}}
     */
    function parseJunitResults(fileName) {
        var results = [];
        if (grunt.file.exists(fileName)) {
            xml2js.parseString(grunt.file.read(fileName), {}, function (err, res) {

                res.testsuites.testsuite.forEach(function (testsuite) {
                    results.push({
                        browser: testsuite.$.name,
                        tests: Number(testsuite.$.tests),
                        failures: Number(testsuite.$.failures),
                        time: Number(testsuite.$.time)
                    });
                });
            });
        }
        return results;
    }

    /**
     * Parse the e2e results.
     * @param fileName The filename.
     * @returns {{junit: {}}}
     */
    function parseE2eResults(fileName) {
        var results = [];
        if (grunt.file.exists(fileName)) {
            xml2js.parseString(grunt.file.read(fileName), {}, function (err, res) {
                res.testsuites.testsuite.forEach(function (testsuite) {
                    results.push({
                        browser: testsuite.$.name,
                        tests: Number(testsuite.$.tests),
                        failures: Number(testsuite.$.failures),
                        time: Number(testsuite.$.time)
                    });
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
            })
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
            xml2js.parseString(grunt.file.read(fileName), {}, function (err, res) {
                result = {
                    tests: Number(res.testsuite.$.tests),
                    failures: Number(res.testsuite.$.failures),
                    errors: Number(res.testsuite.$.errors)
                };
            });
        }
        return result;
    }
};
