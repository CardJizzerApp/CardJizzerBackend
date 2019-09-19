const gulp = require('gulp');
const del = require('del');
const minify = require('gulp-babel-minify');
const concat = require('gulp-concat');

/**
 * @param {*} cb
 */
function cleanDist(cb) {
    del(['dist/**/*'], {force: true});
    cb();
};

/**
 * @param {*} cb
 * Minifying js code.
 */
function defaultTask(cb) {
    gulp.src(['src/**/*.js'])
        .pipe(minify({
            mangle: {
                keepClassName: true,
            },
        }))
        .pipe(gulp.dest('dist'));
    gulp.src(['src/ssl/*']).pipe(gulp.dest('dist/ssl'));
    cb();
}
exports.default = gulp.series(cleanDist, defaultTask);
