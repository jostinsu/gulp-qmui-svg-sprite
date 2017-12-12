var gulp = require('gulp'),
    svgSprite = require('./index.js');

gulp.task('sprite', function () {
    return gulp.src('test/src/svg/**/*.svg')
        .pipe(svgSprite({
            projectNamespaces: 'od',
            separator: '_',
        }))
        .pipe(gulp.dest('test/build'));
});

gulp.task('default', ['sprite']);