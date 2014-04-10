var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

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
    .pipe(notify('Sass compiled'));
});

gulp.task('html', function() {
  gulp.src(paths.jade.src)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.jade.dst))
    .pipe(notify('HTML compiled'));
});

gulp.task('js', function() {
  gulp.src(paths.mainJS.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  gulp.src(paths.allJS.src)
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.allJS.dst))
    .pipe(notify('JavaScript compiled'));
});

gulp.task('default', ['sass', 'html', 'js'], function() {
  var server = livereload();
  gulp.watch(paths.sass.src, ['sass']);
  gulp.watch(paths.jade.src, ['html']);
  gulp.watch(paths.mainJS.src, ['js']);
  gulp.watch(['*.html', 'css/*', 'js/*'], function(e) {
    server.changed(e.path);
  });
});
