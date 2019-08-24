const gulp = require('gulp');
const del = require('del');
const minify = require('gulp-minify');

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
        .pipe(gulp.dest('dist'));
    cb();
}
exports.default = gulp.series(cleanDist, defaultTask);
