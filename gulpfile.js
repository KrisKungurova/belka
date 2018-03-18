var gulp        = require('gulp'),                  //Подключаем Gulp
    sass        = require('gulp-sass'),             //Подключаем Sass пакет,
    browserSync = require('browser-sync'),          //Подключаем Browser Sync
    concat      = require('gulp-concat'),           // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'),         // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'),          // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'),           // Подключаем библиотеку для переименования файлов
    del         = require('del'),                   // Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'),         // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'),     // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'),            // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');    // Подключаем библиотеку для автоматического доб

// gulp.task('mytask', function() {
//   return gulp.src('sours-files')  //берем файлы для обработки
//   .pipe(plugin())  //вызов команды(плагина)
//   .pipe(gulp.dest('folder'))  // выводим
// });

gulp.task('sass', function(){
  return gulp.src(['app/sass/**/*.sass', 'app/sass/**/*.scss'])
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade:true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', ['sass'], function(){
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function(){
  return del.sync('dist/');
});

gulp.task('clear', function(){
  return cache.clearAll();
});

gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'],function(){
  gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.css'], ['sass']);
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src("app/fonts/**/*")
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});