var gulp = require('gulp');
var jscs = require('gulp-jscs');

gulp.task('build', ['jscs']);
gulp.task('default', ['build']);
gulp.task('jscs', function _jscs() {
    return gulp.src([
            './src/**/*.js',
            './gulpfile.js'
        ]).
        pipe(jscs()).
        pipe(jscs.reporter());
});
