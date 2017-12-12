var through = require('through2'),
    SVGSpriter	= require('svg-sprite'),
    gutil = require('gulp-util'),
    PluginError	= gutil.PluginError,
    path = require('path');

const PLUGIN_NAME						= 'gulp-qmui-svg-sprite';

var sources = {};
var defaultConfig = { // SVGSpriter的配置表。
    shape: {
        spacing: {
            padding: 10
        }
    },
    mode: {
        css: {
            bust: false,
            dest: "",
            render: {
                css: {
                    template: "template.css"
                }
            },
            common: "common",
            dimensions: true
        }
    }
};

/**
 * 获取SVGSprite的命名空间
 *
 * @param {String} relative svg文件的相对路径
 */
function getSpriteNameSpaces(relative) {
    return relative.split(path.sep).slice(0, -1).map(function(step, index) {
        if (index !== 0) {
            return step.replace(step.charAt(0), step.charAt(0).toUpperCase());
        }
        return step;
    }).join("").replace(/\s+/g, "");
}

/**
 * 根据svg文件所在文件进行划分
 *
 * @param {Object} file svg源文件
 */
function classification(file){
    var pathSteps = file.relative.split(path.sep);

    if (pathSteps.length >= 2) {
        var spriteNameSpaces = getSpriteNameSpaces(file.relative);
        if (spriteNameSpaces in sources) {
            sources[spriteNameSpaces].push(file);
        } else {
            sources[spriteNameSpaces] = [file];
        }
    } else {
        console.log(pathSteps.pop() + " 文件需包含在文件夹中");
    }
}

/**
 * 根据资源文件制作SVG雪碧图
 *
 * @param {Object} sources 资源文件
 */
function makeSVGSprite(sources) {
    var resources = [];

    for(var spriteNameSpaces in sources) {
        var sourceFiles = sources[spriteNameSpaces];
        var shapes = 0;

        defaultConfig.mode.css.render.css.dest = "css/" + spriteNameSpaces + "Sprite.css";
        defaultConfig.mode.css.sprite = "svg/" + spriteNameSpaces + ".svg";
        var spriter	= new SVGSpriter(defaultConfig);

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

    defaultConfig.shape.id = {
        separator: config.separator,
        generator: function(name){
            var svgName = name.split(path.sep).pop();
            return path.basename(getSpriteNameSpaces(name) + this.separator + svgName, '.svg');
        }
    };
    defaultConfig.mode.css.prefix = "." + config.projectNamespaces + config.separator + "%s";
    defaultConfig.variables = {
        projectNamespaces: config.projectNamespaces,
        separator: config.separator,
        getCommonClassName: function() {
            return function() {
                var svgFolder = this.commonName;
                if (this.shapes.length>0) {
                    svgFolder = this.shapes[0].base.split(this.separator).slice(0, -1).join(this.separator);
                }
                return "." + this.projectNamespaces + this.separator + svgFolder
            }
        }
    };

    return through.obj(function (file, enc, cb) {
        classification(file);
        cb();

    }, function(cb){
        var steam = this;
        makeSVGSprite(sources).forEach(function(file){
            steam.push(file);
        });
        cb()
    });

}

module.exports = gulpQmuiSvgSprite;
