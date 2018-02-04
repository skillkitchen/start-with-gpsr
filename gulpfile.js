// REQUIRE
var fs = require('fs');

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	filter = require('gulp-filter'),
	importer = require('node-sass-globbing'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	requirejsOptimize = require('gulp-requirejs-optimize'),
	connect = require('gulp-connect'),
	pug = require('gulp-pug');

var sassCache = {};

var BASE_DIR = './',
	BUILD_DIR = BASE_DIR + 'build/',
	SOURCE_DIR = BASE_DIR + 'source/';

var PUG_SOURCE_DIR = SOURCE_DIR + '**/*.pug',
	PUG_BUILD_DIR = BUILD_DIR;

var CSS_SOURCE_DIR = SOURCE_DIR + 'css/**/*.scss',
	ALL_SCSS = SOURCE_DIR + '**/*.scss',
	CSS_BUILD_DIR = BUILD_DIR + 'css/';

var JS_SOURCE_DIR = SOURCE_DIR + 'js/**/*.js',
	JS_SOURCE_FILE = SOURCE_DIR + 'js/ui.js',
	JS_BUILD_DIR =  BUILD_DIR + 'js';

var JS_VENDOR_SOURCE_DIR = SOURCE_DIR + 'js/vendor/**/*.js',
	JS_VENDOR_BUILD_DIR = BUILD_DIR + 'js/vendor';

var IMG_SOURCE_DIR = SOURCE_DIR + 'img/**/*',
	IMG_BUILD_DIR = BUILD_DIR + 'img/';

var FONTS_SOURCE_DIR = SOURCE_DIR + 'fonts/**/*',
	FONTS_BUILD_DIR = BUILD_DIR + 'fonts/';

var ICONS_CSS_DIR = '../../source/css/helpers/_icons.scss',
	ICONS_SOURCE_DIR = SOURCE_DIR + 'icons/*.svg',
	ICONS_BUILD_DIR = FONTS_BUILD_DIR;


// TASK : Webserver / Connect
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

// TASK : WEBFONT
var fontName = 'custom_icon_font';

gulp.task('iconfont', function(done){
	gulp.src(ICONS_SOURCE_DIR, {base: './'})
		.pipe(iconfontCss({
			fontName: fontName,
			targetPath: ICONS_CSS_DIR,
			fontPath: '../fonts/'
		}))
		.pipe(iconfont({
			fontName: fontName,
			normalize:true,
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
			fontHeight: 1001
		 }))
		.pipe(gulp.dest(ICONS_BUILD_DIR));

	if(done) done();
});

// TASK : pug
var pugOptions = {
	pretty: true
}

gulp.task('pug', function(done){
	return gulp
	.src(PUG_SOURCE_DIR)
	.pipe(pug(pugOptions))
	.pipe(gulp.dest(PUG_BUILD_DIR))
	.pipe(connect.reload());

	if(done) done();
});

// TASK : Require JS
gulp.task('requirejs', function () {
    return gulp.src(JS_SOURCE_FILE)
        .pipe(requirejsOptimize({
            optimize: 'none'
        }))
        .pipe(gulp.dest(JS_BUILD_DIR))
        .pipe(connect.reload());

        if(done) done();
});

// TASK : SASS
var sassOptions = {
	importer: importer, // use globbing import
	errLogToConsole: true,
	outputStyle: 'expanded'
}

gulp.task('sass', function(done){
	return gulp
	.src(CSS_SOURCE_DIR)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(filter(function(file) {
		var content = file.contents.toString();
		if (sassCache[file.path] != content) {
			sassCache[file.path] = content;
			return true;
		} else {
			return false;
		}
	}))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest(CSS_BUILD_DIR))
	.pipe(connect.reload());

	if(done) done();
});

// TASK : COPY Fonts
gulp.task('copy-fonts', function(done){
	gulp.src(FONTS_SOURCE_DIR)
		.pipe(gulp.dest(FONTS_BUILD_DIR))

	if(done) done();
});

// TASK : COPY JS
gulp.task('copy-js', function(done){
	gulp.src(JS_SOURCE_DIR)
		.pipe(gulp.dest(JS_BUILD_DIR))

	if(done) done();
});

// TASK : COPY IMG
gulp.task('copy-img', function(done){
	gulp.src(IMG_SOURCE_DIR)
		.pipe(gulp.dest(IMG_BUILD_DIR))

	if(done) done();
});

// TASK : COPY JS VENDOR
gulp.task('copy-js_vendor', function(done){
	gulp.src(JS_VENDOR_SOURCE_DIR)
		.pipe(gulp.dest(JS_VENDOR_BUILD_DIR))

	if(done) done();
});

gulp.task('copy', gulp.parallel(
	'copy-fonts',
	'copy-js_vendor',
	'copy-img',
));


// TASK : WATCH
gulp.task('watch-pug', function(){
	return gulp.watch(PUG_SOURCE_DIR, gulp.series('pug'))
});
gulp.task('watch-sass', function(){
	return gulp.watch(ALL_SCSS, gulp.series('sass'))
});
gulp.task('watch-js', function(){
	return gulp.watch(JS_SOURCE_DIR, gulp.series('requirejs'))
});

gulp.task('watch', gulp.parallel(
	'watch-pug',
	'watch-sass',
	'watch-js',
	'connect'
));



// TASK : CLEAN
gulp.task('clean-build', function(done){
	if(fs.existsSync(BUILD_DIR)) {
		return gulp.src(BUILD_DIR, {read: false})
		.pipe(clean());
	}
	if(done) done();
});

gulp.task('clean', gulp.series(
	'clean-build',
));




// INITS
gulp.task('default', gulp.series('clean', 'copy', 'iconfont', 'pug', 'sass','requirejs', 'watch'));










