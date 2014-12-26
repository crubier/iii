var gulp  = require('gulp');
var peg   = require('gulp-peg');
var mocha = require('gulp-mocha');
var newer = require('gulp-newer');
var merge = require('gulp-merge');
var del   = require('del');
var cover = require('gulp-coverage');


var watching = false;
function onError(err) {
  if(watching) {
    this.emit('end');
  }
  else {
    console.log(err.toString());
  }
}

gulp.task('clean', function(cb) {
  del(['lib'], cb);
});

gulp.task('lib',function() {
  return merge(
    gulp.src('src/**/*.js')
    .pipe(newer('lib'))
    .pipe(gulp.dest('lib')),
    gulp.src('src/**/*.pegjs')
    .pipe(newer({dest:'lib',ext:'js'}))
    .pipe(peg())
    .pipe(gulp.dest('lib'))
  );
});

gulp.task ('test',['lib'],function() {
  return gulp.src('test/test.js', { read: false })
  .pipe(cover.instrument({
    pattern: ['lib/*.js']
  }))
  .pipe(mocha({reporter:'min'}))
  .pipe(cover.gather())
  .pipe(cover.format( [ { reporter: 'html', outFile: 'coverage.html' }, { reporter: 'json', outFile: 'coverage.json' } ]))
  .pipe(gulp.dest('doc'))
  .on("error",onError);
});

gulp.task('watch',['lib'], function() {
  gulp.watch('src/**/*.*', ['test']);
  gulp.watch('test/**/*.*', ['test']);
  gulp.watch('example/**/*.*', ['test']);
});

gulp.task('default', ['lib']);
