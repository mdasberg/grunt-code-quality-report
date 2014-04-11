/*
 * grunt-code-quality-report
 * https://github.com/mdasberg/grunt-code-quality-report
 *
 * Copyright (c) 2013 Mischa Dasberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

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
        code_quality_report: {
            options: {
                dir: 'test/results',
                file: 'result.json'
            },
            default: {
                results: {
                    junit: {
                        file: 'test/fixtures/junit/test-results.xml'
                    },
                    e2e: {
                        file: 'test/fixtures/e2e/e2e.xml'
                    },
                    coverage: 'test/fixtures/coverage/*.json',
                    jshint: 'test/fixtures/jshint/jshint.xml'
                }
            },
            override: {
                options: {
                    dir: 'test/override/results',
                    file: 'override-file.json'
                },
                results: {
                    junit: {
                        file: 'test/fixtures/junit/test-results.xml',
                        showDetails: false
                    },
                    e2e: {
                        file: 'test/fixtures/e2e/e2e.xml',
                        showDetails: false
                    },
                    coverage: 'test/fixtures/coverage/*.json',
                    jshint: 'test/fixtures/jshint/jshint.xml'
                }
            },
            overrideWithDetails: {
                options: {
                    dir: 'test/overrideWithDetails/results',
                    file: 'override-file.json'
                },
                results: {
                    junit: {
                        file: 'test/fixtures/junit/test-results.xml',
                        showDetails: true
                    },
                    e2e: {
                        file: 'test/fixtures/e2e/e2e.xml',
                        showDetails: true
                    },
                    coverage: 'test/fixtures/coverage/*.json',
                    jshint: 'test/fixtures/jshint/jshint.xml'
                }
            },
            missing: {
                options: {
                    dir: 'test/missing/results',
                    file: 'missing-file.json'
                },
                results: {
                    junit: {
                        file: 'test/fixtures/missing.xml',
                        showDetails: true
                    },
                    e2e: {
                        file: 'test/fixtures/missing.xml',
                        showDetails: true
                    },
                    coverage: 'test/fixtures/missing/*.json',
                    jshint: 'test/fixtures/missing.xml'
                }
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
    grunt.registerTask('test', ['clean', 'code_quality_report', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
