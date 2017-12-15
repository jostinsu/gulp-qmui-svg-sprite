var through = require('through2'),
    SVGSpriter	= require('svg-sprite'),
    gutil = require('gulp-util'),
    PluginError	= gutil.PluginError,
    _ = require('lodash'),
    path = require('path');


const PLUGIN_NAME						= 'gulp-qmui-svg-sprite';

var sources = {};

/**
 * 构造svg-sprite的配置表
 *
 * @param {Object} options 用户配置的选项
 * @param {String} spriteNameSpaces 雪碧图的命名空间
 */
function makeConfig(options, spriteNameSpaces) {

    var render= {};
    if (options.stylesheet.type === 'scss' || options.stylesheet.type === 'css') {

        var stylesheetDest = '';
        if (options.stylesheet.dest) {
            stylesheetDest = options.stylesheet.dest.indexOf(path.sep) !== -1 ? options.stylesheet.dest : (options.stylesheet.dest + path.sep);
        }
        if (options.stylesheet.type === 'scss') {
            if (!options.stylesheet.compile) {
                stylesheetDest += '_';
            }
        }
        stylesheetDest += spriteNameSpaces;
        if (options.stylesheet.fileSuffix) {
            stylesheetDest += options.stylesheet.fileSuffix;
        }

        render[options.stylesheet.type] = {
            dest: stylesheetDest,
            template: options.template.path
        };
    } else {
        console.log('the type of stylesheet should be scss or css');
    }

    var sprite = '';
    if(options.svg.dest) {
        sprite += (options.svg.dest.indexOf(path.sep) !== -1 ? options.svg.dest : (options.svg.dest + path.sep))
    }
    sprite += spriteNameSpaces;
    if (options.svg.fileSuffix) {
        sprite += options.svg.fileSuffix;
    }

    var classNamePrefix = '';
    if (options.stylesheet.classNamePrefix) {
        if (options.stylesheet.classNamePrefix.indexOf('.') === -1) {
            classNamePrefix += '.';
        }
        if (options.stylesheet.classNamePrefix.charAt(options.stylesheet.classNamePrefix.length - 1) === options.stylesheet.classNameSeparator) {
            classNamePrefix += options.stylesheet.classNamePrefix;
        } else {
            classNamePrefix += options.stylesheet.classNamePrefix + options.stylesheet.classNameSeparator;
        }
    }

    var templateVariables = _.assign({
        classNamePrefix: classNamePrefix,
        spriteNameSpaces: spriteNameSpaces,
        spriteName: spriteNameSpaces + options.svg.fileSuffix + ".svg",
        getCommonClassName: function () {
            return function () {
                return this.classNamePrefix + this.spriteNameSpaces
            }
        }
    }, options.template.variables);

    return {
        shape: {
            spacing: {
                padding: 10
            },
            id: {
                separator: options.stylesheet.classNameSeparator,
                spriteNameSpaces: spriteNameSpaces,
                generator: function(name){
                    var svgName = name.split(path.sep).pop();
                    return path.basename(this.spriteNameSpaces + this.separator + svgName, '.svg');
                },
            }
        },
        mode: {
            css: {
                bust: options.stylesheet.bust,
                dest: '',
                render: render,
                prefix: classNamePrefix + '%s',
                sprite: sprite,
                common: 'common',
                dimensions: true
            }
        },
        variables: templateVariables
    }
}

/**
 * 根据svg文件所在文件进行划分
 *
 * @param {Object} file svg源文件
 */
function classification(file) {
    var pathSteps = file.relative.split(path.sep);

    if (pathSteps.length >= 2) {
        var spriteNameSpaces = getSpriteNameSpaces(file.relative);
        if (spriteNameSpaces in sources) {
            sources[spriteNameSpaces].push(file);
        } else {
            sources[spriteNameSpaces] = [file];
        }
    } else {
        console.log(pathSteps.pop() + ' 文件需包含在文件夹中');
    }

    /**
     * 根据文件路径构建SVGSprite的命名空间
     *
     * @param {String} relative svg文件的相对路径
     */
    function getSpriteNameSpaces(relative) {
        return relative.split(path.sep).slice(0, -1).map(function(step, index) {
            if (index !== 0) {
                return step.replace(step.charAt(0), step.charAt(0).toUpperCase());
            }
            return step;
        }).join('').replace(/\s+/g, '');
    }
}

/**
 * 根据资源文件制作SVG雪碧图
 *
 * @param {Object} sources 资源文件
 */
function compileSVGSprite(options) {
    var resources = [];

    for(var spriteNameSpaces in sources) {
        var sourceFiles = sources[spriteNameSpaces],
            shapes = 0,
            config = makeConfig(options, spriteNameSpaces),
            spriter	= new SVGSpriter(config);

        // gutil.log(config.mode.css);
        sourceFiles.forEach(function(file) {
            spriter.add(file);
            ++shapes;
        });

        spriter.compile(function(error, result){
            if (error) {
                console.log(error);
            } else if (shapes > 0) {
                for (var mode in result) {
                    for (var resource in result[mode]) {
                        resources.push(result[mode][resource]);
                    }
                }
            }
        });
    }
    return resources;
}

/**
 * gulp-qmui-svg-sprite 入口函数
 *
 * @param {Object} config 配置表
 */
function gulpQmuiSvgSprite(config) {

    return through.obj(function (file, enc, cb) {
        classification(file);
        cb();

    }, function(cb){
        var steam = this;
        compileSVGSprite(config).forEach(function(file){
            steam.push(file);
        });
        cb()
    });

}

module.exports = gulpQmuiSvgSprite;
