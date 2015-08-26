var gulp      = require('gulp');
var concat    = require('gulp-concat');
var jade      = require('gulp-jade');
var stylus    = require('gulp-stylus');
var cache     = require('gulp-cache');
var size      = require('gulp-size');
var filter    = require('gulp-filter');
var flatten   = require('gulp-flatten');
var uglify    = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var del       = require('del');
var sourcemaps= require('gulp-sourcemaps');

var _buildFolder = './build',
    _distFolder = _buildFolder + '/dist',
    _publicFolder = _buildFolder + '/public',
    _srcFolder = "./public";

var folders = {
    "src": {
        "root": _srcFolder,
        "script": _srcFolder + "/script",
        "styles": _srcFolder + "/styles",
        "images": _srcFolder + "/images"
    },
    "output": {
        "root": _buildFolder,
        "public": {
            "root": _publicFolder,
            "script": _publicFolder + "/script",
            "styles": _publicFolder + "/styles",
            "fonts": _publicFolder + "/fonts",
            "images": _publicFolder + "/images"
        }
    },
    "dist": _distFolder
};

gulp.task('appJS', function() {
    gulp.src(folders.src.script + '/**/*.js')
        .pipe(gulp.dest(folders.output.public.script))
        .pipe(sourcemaps.init())
            .pipe(concat('app.min.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(folders.output.public.script));
});

gulp.task('libJS', function() {
    gulp.src([
        './bower_components/angular*/angular*.js',
        './bower_components/angular*/angular*.map',
        './bower_components/jquery/dist/jquery*'
    ]).pipe(gulp.dest(folders.output.public.script));

    gulp.src([
        './bower_components/bootstrap-stylus/js/transition.js',
        './bower_components/bootstrap-stylus/js/alert.js',
        './bower_components/bootstrap-stylus/js/button.js',
        './bower_components/bootstrap-stylus/js/carousel.js',
        './bower_components/bootstrap-stylus/js/collapse.js',
        './bower_components/bootstrap-stylus/js/dropdown.js',
        './bower_components/bootstrap-stylus/js/modal.js',
        './bower_components/bootstrap-stylus/js/tooltip.js',
        './bower_components/bootstrap-stylus/js/popover.js',
        './bower_components/bootstrap-stylus/js/scrollspy.js',
        './bower_components/bootstrap-stylus/js/tab.js',
        './bower_components/bootstrap-stylus/js/affix.js'])
        .pipe(concat('bootstrap.js'))
        .pipe(uglify())
        .pipe(gulp.dest(folders.output.public.script));
});

gulp.task('appCSS', function() {
    // concatenate compiled Stylus and CSS
    // into build/app.css
    gulp.src(folders.src.styles + '/app.styl')
        .pipe(stylus())
        .pipe(concat('app.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(folders.output.public.styles))
});

gulp.task('libCSS', function() {
    // concatenate vendor css into build/lib.css
    gulp.src([
        './bower_components/**/*.css'
    ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(folders.output.public.styles));
});

gulp.task('fonts', function () {
    gulp.src(folders.src.root + '/favicon.ico')
        .pipe(gulp.dest(folders.output.public.root));
    return gulp.src([folders.src.styles + '/fonts/**/*',
        'bower_components/bootstrap-stylus/fonts/*'])
        .pipe(filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(flatten())
        .pipe(gulp.dest(folders.output.public.fonts))
        .pipe(size());
});

gulp.task('images', function () {
    return gulp.src([
        folders.src.images + '/**/**'
    ]).pipe(gulp.dest(folders.output.public.images))
        .pipe(size());
});

gulp.task('build', ['appJS', 'libJS', 'appCSS', 'libCSS', 'fonts', 'images']);

gulp.task('dist', ['build'], function() {
    // Views
    gulp.src('./views/**')
        .pipe(gulp.dest(folders.dist + '/views'));
    // Locales
    gulp.src('./locales/**')
        .pipe(gulp.dest(folders.dist + '/locales'));
    // copy public build files
    gulp.src(folders.output.public.root + '/**')
        .pipe(gulp.dest(folders.dist + '/public'));
    // conf .json files
    gulp.src([
        './production.json',
        './development.json',
        './package.json',
        './password.json'
    ]).pipe(gulp.dest(folders.dist));
    // Routes
    gulp.src('./routes/*')
        .pipe(gulp.dest(folders.dist + '/routes'));
    // JS server files
    gulp.src([
        './server.js',
        './estateService.js',
        './redisCached.js'
    ]).pipe(gulp.dest(folders.dist));
    gulp.src([
        './bin/*'
    ]).pipe(gulp.dest(folders.dist + '/bin'));
});

gulp.task('watch', ['build'], function() {
    // watch files to build
    gulp.watch(['./public/script/*.js'], ['appJS']);
    gulp.watch(['./public/styles/*.styl'], ['appCSS']);
    gulp.watch(['./public/styles/fonts/**/*'], ['fonts']);
    gulp.watch(['./public/images/**/*'], ['images']);
});

gulp.task('default', ['build']);

gulp.task('clean', function() {
    del(folders.output.root);
});