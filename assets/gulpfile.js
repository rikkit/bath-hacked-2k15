// ==========================================================================
// # DEPENDENCIES
// ==========================================================================

var gulp = require('gulp'),
gulpLoadPlugins = require('gulp-load-plugins');

plugins = gulpLoadPlugins();

plugins.prefix = require('gulp-autoprefixer');
plugins.postcss = require('gulp-postcss');
plugins.pixrem = require('pixrem');
plugins.csswring = require('csswring');
plugins.mqpacker = require('css-mqpacker');
plugins.sass = require("gulp-sass");
plugins.sourcemaps = require("gulp-sourcemaps");
plugins.jshint = require('gulp-jshint');
pluginsstylish = require('jshint-stylish');
plugins.mocha = require('gulp-mocha');
plugins.argv = require('yargs').argv;

// ==========================================================================
// # CONSTANTS
// ==========================================================================

var basePath      = "./";

cssSrcDir       = basePath + 'sass',
cssSrcFiles     = cssSrcDir + '/**/*.scss',
cssDestDir      = basePath + 'css',
cssDestFiles    = cssDestDir + '/*.css',

jsSrcDir      = basePath + 'js',
jsSrcFiles    = [jsSrcDir + '/**/*.js', !jsSrcDir + '/es6-module-loader.js', !jsSrcDir + '/system.js', !jsSrcDir + '/traceur.js', !jsSrcDir + '/vendor/*.js'];

// ==========================================================================
// # TASKS
// ==========================================================================

// # JSHINT
// ==========================================================================

gulp.task('jshint', function () {
    return gulp.src([
        jsSrcDir + '/**/*.js',
        '!' + jsSrcDir + '/es6-module-loader.js',
        '!' + jsSrcDir + '/es6-module-loader.src.js',
        '!' + jsSrcDir + '/system.js',
        '!' + jsSrcDir + '/traceur.js',
        '!' + jsSrcDir + '/vendor/*.js'
    ])
    .pipe(plugins.jshint({esnext: true}))
    .pipe(plugins.jshint.reporter(plugins.stylish));
});

/* # CSS
   ========================================================================== */

gulp.task('sass', function () {
    var processors = [
        plugins.mqpacker,
        plugins.pixrem,
        plugins.csswring
    ];
    gulp.src(cssSrcFiles)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.prefix())
        .pipe(plugins.postcss(processors))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(cssDestDir));

});

// ==========================================================================
// # CORE TASKS
// ==========================================================================

// Default task
gulp.task('default', ['sass'], function () {
    gulp.watch(cssSrcFiles, ['sass']);
});

// Build
gulp.task('build', ['sass']);
