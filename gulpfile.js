var gulp  = require('gulp');
var peg   = require('gulp-peg');
var newer = require('gulp-newer');
var del   = require('del');

var jest = require('gulp-jest');

gulp.task('jest',['dist'], function () {
    return gulp.src('./').pipe(jest({
        // scriptPreprocessor: "./spec/support/preprocessor.js",
        unmockedModulePathPatterns: [
            "node_modules/react"
        ],
        // testDirectoryName: "spec",
        testPathIgnorePatterns: [
            "node_modules",
            "src"
        ],
        moduleFileExtensions: [
            "js",
            "json",
            "react"
        ],
        collectCoverage:true
    }));
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('dist',['parser','javascript'],function() {

});

gulp.task('javascript',function() {
  return gulp.src('src/**/*.js')
  // .pipe(newer('dist'))
  .pipe(gulp.dest('dist'));
});

gulp.task('parser',function() {
  return gulp.src('src/**/*.pegjs')
  .pipe(peg({
    allowedStartRules:["start","interaction","interface","data"]
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch',['dist'], function() {
  gulp.watch('src/**/*.*', ['test']);
  gulp.watch('test/**/*.*', ['test']);
  gulp.watch('example/**/*.*', ['test']);
});

gulp.task('prepublish',['dist']);

gulp.task('default', ['dist']);
