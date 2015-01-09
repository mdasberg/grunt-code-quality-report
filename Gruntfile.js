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
                dir: '.tmp/results',
                file: 'result.json'
            },
            default: {
                results: {
                    junit: {
                        results: {
                            file: 'test/fixtures/junit/results/test-results.xml'
                        },
                        coverage: {
                            file: 'test/fixtures/junit/coverage/Chrome 30.0.1599 (Mac OS X 10.8.5)/coverage-final.json'
                        }
                    },
                    e2e: {
                        results: {
                            file: 'test/fixtures/e2e/results/e2e.xml'
                        },
                        coverage: {
                            file: 'test/fixtures/e2e/coverage/Chrome 30.0.1599 (Mac OS X 10.8.5)/coverage.json'
                        }
                    },
                    jshint: {
                        file: 'test/fixtures/jshint/jshint.xml'
                    }
                }
            }
            ,
            defaultWithMultipleTestFiles: {
                options: {
                    dir: '.tmp/defaultWithMultipleTestFiles/results',
                    file: 'default-file.json'
                },
                results: {
                    junit: {
                        results: {
                            dir: 'test/fixtures/junit/results/TEST-*.xml'
                        },
                        coverage: {
                            dir: 'test/fixtures/junit/coverage/**/coverage*.json'
                        }
                    },
                    e2e: {
                        results: {
                            dir: 'test/fixtures/e2e/results/TEST-*.xml'
                        },
                        coverage: {
                            dir: 'test/fixtures/e2e/coverage/**/coverage*.json'
                        }
                    }
                }
            },
            defaultWithoutTestCases: {
                options: {
                    dir: '.tmp/defaultWithoutTestCases/results',
                    file: 'default-file.json'
                },
                results: {
                    junit: {
                        results: {
                            file: 'test/fixtures/junit/results/test-results-without-testcases.xml'
                        }
                    },
                    e2e: {
                        results: {
                            file: 'test/fixtures/e2e/results/e2e-without-testcases.xml'
                        }
                    }
                }
            },
            override: {
                options: {
                    dir: '.tmp/override/results',
                    file: 'override-file.json'
                },
                results: {
                    junit: {
                        results: {
                            file: 'test/fixtures/junit/results/test-results.xml',
                            details: false
                        },
                        coverage: {
                            dir: 'test/fixtures/junit/coverage/**/coverage*.json'
                        }
                    },
                    e2e: {
                        results: {
                            file: 'test/fixtures/e2e/results/e2e.xml',
                            details: false
                        },
                        coverage: {
                            dir: 'test/fixtures/e2e/coverage/**/coverage*.json'
                        }
                    },
                    jshint: {
                        file: 'test/fixtures/jshint/jshint.xml',
                        details: false
                    }
                }
            },
            overrideWithDetails: {
                options: {
                    dir: '.tmp/overrideWithDetails/results',
                    file: 'override-file.json'
                },
                results: {
                    junit: {
                        results: {
                            file: 'test/fixtures/junit/results/test-results.xml',
                            details: true
                        }
                    },
                    e2e: {
                        results: {
                            file: 'test/fixtures/e2e/results/e2e.xml',
                            details: true
                        }
                    },
                    jshint: {
                        file: 'test/fixtures/jshint/jshint.xml',
                        details: true
                    }
                }
            },
            missing: {
                options: {
                    dir: '.tmp/missing/results',
                    file: 'missing-file.json'
                },
                results: {
                    junit: {
                        results: {
                            file: 'test/fixtures/missing.xml'
                        },
                        coverage: {
                            dir: 'test/fixtures/junit/coverage/**/missing*.json'
                        }
                    },
                    e2e: {
                        results: {
                            file: 'test/fixtures/missing.xml'
                        },
                        coverage: {
                            dir: 'test/fixtures/e2e/coverage/**/missing*.json'
                        }
                    },
                    jshint: 'test/fixtures/missing.xml'
                }
            },
            undefined: {
                options: {
                    dir: '.tmp/undefined/results',
                    file: 'undefined-file.json'
                },
                results: {
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
