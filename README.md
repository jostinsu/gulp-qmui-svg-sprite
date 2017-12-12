# gulp-qmui-svg-sprite
A Gulp plugin wrapping around [svg-sprite](https://github.com/jkphl/svg-sprite) to generate SVG sprites.

## Usage
```shell
npm install --save-dev gulp-qmui-svg-sprite
```

Work with Gulp
```javascript
var gulp = require('gulp'),
    svgSprite = require('gulp-qmui-svg-sprite');

gulp.src('path/to/assets/*.svg')
     .pipe(svgSprite(config))
     .pipe(gulp.dest('out'));

```
## Example

create 'sprite' task
```javascript
var gulp = require('gulp'),
    svgSprite = require('gulp-qmui-svg-sprite');

gulp.task('sprite', function () {
    return gulp.src('test/src/svg/**/*.svg')
        .pipe(svgSprite({
            projectNamespaces: 'od',
            separator: '_',
        }))
        .pipe(gulp.dest('test/build'));
});
```

put some SVG source files into './test/src/svg'
```
.
├── gulpfile.js
├── test
    └── src
        └── svg
            └── common                
                ├── Succ.svg
                ├── Error.svg
                └── Fail.svg
            └── icons
                ├── Mail.svg
                ├── Tel.svg
                └── Msg.svg
```

then run the 'sprite' task to generate SVG sprite and css
```
.
├── gulpfile.js
├── test
    ├── src
    └── build
        └── css          
            ├── commonSprite.css
            └── iconsSprite.css
        └── svg
            ├── common.svg
            └── icons.svg
```
finally use in html
```html
<head>
    <link rel="stylesheet" href="./test/build/css/commonSprite.css">
    <link rel="stylesheet" href="./test/build/css/iconsSprite.css">
</head>
<body>
    <i class="od_common od_common_Succ"></i>
    <i class="od_icons od_icons_Mail"></i>
</body>
```

## Config
projectNamespaces
- Default: "svg"
- Required: false

separator
- Default: "_"
- Required: false
