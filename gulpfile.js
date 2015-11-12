var gulp = require('gulp');
var jscs = require('gulp-jscs');
var eslint = require('gulp-eslint');

gulp.task('build', ['jscs', 'lint', 'lint-test']);
gulp.task('default', ['build']);

gulp.task('jscs', function _jscs() {
    return gulp.src([
            './src/**/*.js',
            './gulpfile.js'
        ]).
        pipe(jscs()).
        pipe(jscs.reporter());
});

gulp.task('lint', function _lint() {
    return gulp.src(['src/**/*.js']).
        pipe(eslint()).
        pipe(eslint.format()).
        pipe(eslint.failAfterError());
});

gulp.task('lint-test', function _lint() {
    return gulp.src(['test/**/*.js']).
        pipe(eslint({
            globals: {
                describe: false,
                it: true
            },
            rules: {
                'no-unused-expressions': [ 0 ]
            }
        })).
        pipe(eslint.format()).
        pipe(eslint.failAfterError());
});
