# grunt-code-quality-report

> Grunt plugin that reports on [Karma](https://github.com/karma-runner/karma) junit and coverage and [Jshint](http://www.jshint.com/) results as a code quality reporter.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-code-quality-report --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-code-quality-report');
```

## The "code_quality_report" task

### Overview
In your project's Gruntfile, add a section named `code_quality_report` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  code_quality_report: {
    options: {
       dir: 'test/results',
       file: 'result.json'
    },
    your_target: {
       results: {
         junit: {
            file: 'path/to/junit/dir/results-file.xml'
         }
         coverage: 'path/to/coverage/dir/*.json'
         jshint: 'path/to/jshint/div/result-file.xml'
       }
    },
  },
})
```

### Options

#### options.dir
Type: `String`
Default value: `'.'`

The directory location where the result is stored.

#### options.file
Type: `String`
Default value: `'result.json'`

The name of the file in which the result is stored.

### Usage Examples

#### Default Options
In this example, the default options are used for writing the result.

```js
grunt.initConfig({
  code_quality_report: {
    options: {},
    your_target: {
       results: {
         junit: {
            file: 'path/to/junit/dir/results-file.xml'
         }
         coverage: 'path/to/coverage/dir/*.json'
         jshint: 'path/to/jshint/div/result-file.xml'
       }
    },
  },
})
```

#### Override Options
In this example, custom options are used to for writing the result.

```js
grunt.initConfig({
  code_quality_report: {
    options: {
       dir: 'test/results',
       file: 'result.json'
    },
    your_target: {
       results: {
         junit: {
            file: 'path/to/junit/dir/results-file.xml',
            showDetails: true
         }
         coverage: 'path/to/coverage/dir/*.json'
         jshint: 'path/to/jshint/div/result-file.xml'
       }
    },
  },
})
```

## Contributing
In line of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
See the [CHANGELOG](CHANGELOG).
