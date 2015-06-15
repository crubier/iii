var gulp  = require('gulp');
var peg   = require('gulp-peg');
var newer = require('gulp-newer');
var del   = require('del');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');


gulp.task('clean', function(cb) {
  del(['lib'], cb);
});

gulp.task('lib',['parser','javascript'],function() {

});

gulp.task('javascript',function() {
  return gulp.src('src/**/*.js')
  // .pipe(newer('lib'))
  .pipe(gulp.dest('lib'));
});

gulp.task('parser',function() {
  return gulp.src('src/**/*.pegjs')
  .pipe(peg())
  .pipe(gulp.dest('lib'));
});

gulp.task('test',['lib'], function (cb) {
  gulp.src('lib/**/*.js')
  .pipe(plumber())
  .pipe(istanbul())
  .pipe(istanbul.hookRequire())
  .on('finish', function () {
    gulp.src('test/test.js')
    .pipe(plumber())
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .on('end', cb);
  });
});

gulp.task('watch',['lib'], function() {
  gulp.watch('src/**/*.*', ['test']);
  gulp.watch('test/**/*.*', ['test']);
  gulp.watch('example/**/*.*', ['test']);
});

gulp.task('default', ['lib']);
