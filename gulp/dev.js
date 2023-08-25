const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const clean = require('gulp-clean');
const fs = require('fs');

// HTML
const fileInclude = require('gulp-file-include');
// const webpHtml = require('gulp-webp-html');
const webpHtml = require('gulp-webp-html-fixed');

// SCSS
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const tailwindcss = require('tailwindcss');
const postcss = require('gulp-postcss');

// IMAGE
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const groupMedia = require("gulp-group-css-media-queries");


const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
}
const serverSettings = {
    livereload: true,
    open: true
}
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}


gulp.task('clean:dev', function (done) {
    if (fs.existsSync('./dist')) {
        return gulp.src('./dist', { read: false })
            .pipe(clean({ force: true }))
    }

    done();
})

gulp.task('html:dev', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./dist/', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(webpHtml())
        .pipe(gulp.dest('./dist'))
});

gulp.task('sass:dev', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./dist/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(groupMedia())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            tailwindcss(require('./../tailwind.config.js'))
        ]))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
})

gulp.task('js:dev', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./dist/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./dist/js/'))
})

gulp.task('images:dev', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./dist/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./dist/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./dist/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./dist/img/'))
})

gulp.task('fonts:dev', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./dist/fonts/'))
        .pipe(gulp.dest('./dist/fonts/'))
})

gulp.task('server:dev', function (done) {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        port: 5000,
    });

    done();
})
gulp.task('serverReload:dev', function (done) {
    browserSync.reload();

    done();
})

gulp.task('watch:dev', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev', 'serverReload:dev'))
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev', 'sass:dev', 'serverReload:dev'))
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev', 'sass:dev', 'serverReload:dev'))
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev', 'serverReload:dev'))
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev', 'serverReload:dev'))
})