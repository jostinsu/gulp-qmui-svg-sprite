var gulp = require('gulp'),
    svgSprite = require('./index.js'),
    gutil = require('gulp-util');

var options = {
    stylesheet: {
        bust: false,
        type: 'css',
        compile: false,
        fileSuffix: 'Sprite',
        dest: 'css',
        classNamePrefix: 'od',
        classNameSeparator: '_'
    },
    svg: {
        fileSuffix: '',
        dest: 'svg'
    },
    template: {
        path: "template.tpl",
        variables: {}
    }
};

gulp.task('sprite', function () {
    return gulp.src('test/src/svg/**/*.svg')
        .pipe(svgSprite(options))
        .pipe(gulp.dest('test/build'));
});

gulp.task('watch', function(){
    gulp.watch('test/src/svg/**/*.svg', ['sprite']).on('change', function(evt) {
        gutil.log("构建SVG雪碧图")
    });
});

gulp.task('default', ['watch']);
