var gulp = require('gulp'),
    qmuiGulpSvgSprite = require('./index.js');

gulp.task('svgSprite', function () {
    return gulp.src('test/src/svg/**/*.svg', {base: 'test/src/svg/'})
        .pipe(qmuiGulpSvgSprite({
            projectNamespaces: 'od',
            separator: '_',
        }))
        .pipe(gulp.dest('test/build'));
});

gulp.task('default', ['svgSprite']);