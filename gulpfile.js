var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify');

var paths = {
    sass: { src:'components/sass/main.scss', dst: 'css/' },
    jade: { src: 'components/jade/*.jade', dst: './' },
    mainJS: { src: 'components/js/main.js' },
    allJS: { src: ['components/js/lib/*.js', 'components/js/*.js'], dst: 'js/' }
};

gulp.task('sass', function() {
  gulp.src(paths.sass.src)
    .pipe(compass({
      css: 'css',
      sass: 'components/sass',
      style: 'expanded'
    }))
    .pipe(notify('Sass compiled'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src(paths.jade.src)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.jade.dst))
    .pipe(notify('HTML compiled'))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  gulp.src(paths.mainJS.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  gulp.src(paths.allJS.src)
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.allJS.dst))
    .pipe(notify('JavaScript compiled'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('default', ['sass', 'html', 'js', 'connect'], function() {
  gulp.watch(paths.sass.src, ['sass']);
  gulp.watch(paths.jade.src, ['html']);
  gulp.watch(paths.mainJS.src, ['js']);
});
