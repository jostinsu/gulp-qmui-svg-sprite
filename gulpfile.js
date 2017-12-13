var gulp = require('gulp'),
    svgSprite = require('./index.js');


// var changeEvent = function(evt) {
//     $.gutil.log('File', $.gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', $.gutil.colors.magenta(evt.type));
// };

var projectNamespaces = "ww";

var options = {
    stylesheet: {
        bust: false,
        type: "css",
        compile: false,
        fileSuffix: "Sprite",
        dest: "css",
        classNamePrefix: projectNamespaces,
        classNameSeparator: "_",
    },
    svg: {
        fileSuffix: "",
        dest: "svg"
    },
    template: {
        variables: {}
    }
};

gulp.task('sprite', function () {
    return gulp.src('test/src/svg/**/*.svg')
        .pipe(svgSprite(options))
        .pipe(gulp.dest('test/build'));
});

// gulp.task('watch', function(){
//     gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
//         changeEvent(evt);
//     });
// });

gulp.task('default', ['sprite']);
