const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ camelize: true });
const runSequence = require('run-sequence');

gulp.task('css', () => gulp.src('app/styles/main.scss')
  .pipe($.sourcemaps.init())
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('./dist')));

gulp.task('css:watch', ['css'], () => {
  gulp.watch('app/styles/**/*.scss', ['css']);
});

gulp.task('moveAssets', () => gulp.src('./app/assets/**/*')
  .pipe(gulp.dest('./dist/assets')));

gulp.task('build:revAssets', ['css', 'moveAssets'], () => {
  const rev = new $.revAll();
  return gulp.src('./dist/**/*')
    .pipe(rev.revision())
    .pipe(gulp.dest('./dist/public'))
    .pipe(rev.manifestFile())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:cpServer', () => gulp.src('./app/**/*.{js,ejs}')
  .pipe(gulp.dest('./dist/server-build')));

gulp.task('build:revServer', ['build:cpServer'], () => {
  const manifest = gulp.src('./dist/rev-manifest.json');
  return gulp.src('./dist/server-build/{components,containers}/**/*')
    .pipe($.revReplace({ manifest }))
    .pipe(gulp.dest('./dist/server-build'));
});

gulp.task('build', () => {
  runSequence('build:revAssets', 'build:revServer');
});
