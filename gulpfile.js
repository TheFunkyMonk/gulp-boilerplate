var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    _if = require('gulp-if'),
    isWindows = /^win/.test(require('os').platform()),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    paths = {
      sass: { src:'src/sass/main.scss', dst: './public/css/', wch: 'src/sass/**/*' },
      jade: { src: 'src/jade/*.jade', dst: './public/', wch: 'src/jade/**/*' },
      mainJS: { src: 'src/js/main.js' },
      allJS: { src: 'src/js/**/*', dst: './public/js/' }
    };

gulp.task('sass', function() {
  gulp.src(paths.sass.src)
    .pipe(plumber())
    .pipe(sass({
      style: 'expanded'
    }))
    .pipe(gulp.dest(paths.sass.dst))
    .pipe(_if(!isWindows, notify('Sass compiled')))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src(paths.jade.src)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.jade.dst))
    .pipe(_if(!isWindows, notify('HTML compiled')))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  gulp.src(paths.mainJS.src)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  gulp.src(paths.allJS.src)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.allJS.dst))
    .pipe(_if(!isWindows, notify('JavaScript compiled')))
    .pipe(connect.reload());
});

gulp.task('copy', function() {
  gulp.src(['src/*.{txt,xml,ico}', 'src/img'])
    .pipe(gulp.dest('public'));
});

gulp.task('connect', function() {
  connect.server({
    port: 8080,
    livereload: true,
    root: './public'
  });
});

gulp.task('clean', function () {
  return gulp.src('./public/', {read: false})
    .pipe(clean());
});

gulp.task('default', ['sass', 'html', 'js', 'copy', 'connect'], function() {
  gulp.watch(paths.sass.wch, ['sass']);
  gulp.watch(paths.jade.wch, ['html']);
  gulp.watch(paths.mainJS.src, ['js']);
});
