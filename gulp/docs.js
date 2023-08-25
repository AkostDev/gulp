const gulp = require('gulp');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const clean = require('gulp-clean');
const fs = require('fs');

// HTML
const fileInclude = require('gulp-file-include');
const webpHtml = require('gulp-webp-html');

// SCSS
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');

// IMAGE
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");


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

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs')) {
        return gulp.src('./docs', { read: false })
            .pipe(clean({ force: true }))
    }

    done();
})

gulp.task('html:docs', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(webpHtml())
        .pipe(gulp.dest('./docs'))
});

gulp.task('sass:docs', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(groupMedia())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            tailwindcss(require('./../tailwind.config.js'))
        ]))
        .pipe(csso())
        .pipe(gulp.dest('./docs/css/'))
})

gulp.task('js:docs', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config')))
        .pipe(gulp.dest('./docs/js/'))
})

gulp.task('images:docs', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/img/'))
})

gulp.task('fonts:docs', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
})