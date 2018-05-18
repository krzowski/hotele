// Commands to install:
// sudo npm install gulp -g
// npm init
// npm install --save-dev gulp gulp-sass browser-sync gulp-useref gulp-uglify npm install gulp-cssnano gulp-imagemin gulp-cache del run-sequence gulp-autoprefixer

// then run live server:
// gulp watch

// or make prod
// gulp build




var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');





gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 20 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache( imagemin() ))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('svg', function() {
  return gulp.src('app/svg/**/*.svg')
  .pipe(gulp.dest('dist/svg'))
})



gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});




// final build command
gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'svg'], callback)
});