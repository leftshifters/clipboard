'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('start', function() {
  nodemon({
    script: 'app.js',
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'clipboard*'
    },
    ignore: ['node_modules', 'public']
  });
});
