'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch')
var gen = require('./admin/config/generator.json');
var wait = require('gulp-wait')
var rename = require('gulp-rename');
var injStr = require('gulp-inject-string');
var chalk = require('chalk');
//var config = require("./admin/app/json/gulp-config.json");
var uglify = require('gulp-uglify');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var merge = require('gulp-merge-json');
var inject = require('gulp-inject');
var data = require('gulp-data');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var itemList = require('./admin/app/json/item-list.json');
var postList = require('./admin/app/json/post-list.json');
var filelist = require('gulp-filelist');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var replace = require('gulp-replace');


gulp.task('min', function () {
	return gulp.src('./node/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./node'));
});





// Task to watch for changes and reload server

gulp.task('start', function() {
  //livereload.listen()

  nodemon({})
  .on('start', ['watch'])
  .on('change', ['watch']);
});



gulp.task('reload', function () {
		livereload.reload();
});

gulp.task('min:db', function () {
	return gulp.src('./admin/public/data/encryption/db.json')
		.pipe(uglify())
		.pipe(gulp.dest('./admin/public/data/encryption'))
		.pipe(livereload());
});

gulp.task('merge:todo', function () {
	return gulp.src('./admin/public/data/todo/todos/**/*.json')
		.pipe(merge({'startObj':[],'concatArrays':true}))
		.pipe(rename('todo.json'))
		.pipe(gulp.dest('./admin/public/data/todo'))
		.pipe(livereload());
});

gulp.task('merge:item', function () {
	return gulp.src('./admin/public/data/item/single/*.json')
		.pipe(merge({'startObj':[],'concatArrays':true}))
		.pipe(rename('items.json'))
		.pipe(gulp.dest('./admin/public/data/item'))
		.pipe(livereload());
});

gulp.task('merge:post', function () {
	return gulp.src('./admin/public/data/blog/post/*.json')
		.pipe(merge({'startObj':[],'concatArrays':true}))
		.pipe(rename('posts.json'))
		.pipe(gulp.dest('./admin/public/data/blog'))
		.pipe(livereload());
});

gulp.task('fileList:item', function () {
	return gulp.src('./admin/public/data/item/single/*.json')
		.pipe(filelist('itemFileList.json', { flatten: true }))
		.pipe(gulp.dest('./admin/public/data/item/list'))
		.pipe(livereload());
});

gulp.task('fileList:todo', function () {
	return gulp.src('./admin/public/data/todo/todos/*.json')
		.pipe(filelist('todoFileList.json', { flatten: true }))
		.pipe(gulp.dest('./admin/public/data/todo/list'))
		.pipe(livereload());
});
  
gulp.task('fileList:post', function () {
	return gulp.src('./admin/public/data/blog/post/*.json')
		.pipe(filelist('postFileList.json', { flatten: true }))
		.pipe(gulp.dest('./admin/public/data/blog/list'))
		.pipe(livereload());
});


gulp.task('config:replace', function(){
  gulp.src(['./admin/config/config.json'])
    .pipe(replace('"false"', 'false'))
	.pipe(replace('"true"', 'true'))
    .pipe(gulp.dest('./admin/config/'))
	//.pipe(wait(500))
	.pipe(livereload());
});

gulp.task('wait', function(){
	
 gulp.src('./admin/public/front/pages/layouts/index.html')

 //.pipe(wait(5000));
});


gulp.task('inject:after', function(){
	
return gulp.src('./admin/public/front/pages/layouts/index.html')
	.pipe(injStr.after('<!-- controllers -->', '\n<script src="scripts/controllers/' + gen.controller + '.js"></script>'))
	.pipe(gulp.dest('./admin/public/front/pages/layouts/'));
});

gulp.task('WATCH', function () {
	//livereload.listen();
	//gulp.watch('./admin/config/config.json', ['config:replace']);
	gulp.watch('./admin/public/data/blog/post/*.json', ['fileList:post']);
	gulp.watch('./admin/public/data/todo/todos/*.json', ['fileList:todo']);
	gulp.watch('./admin/public/data/item/single/*.json', ['fileList:item']);
	gulp.watch('./admin/data/encryption/*.json', ['config:replace']);
	gulp.watch('./admin/public/data/encryption/db.json', ['min:db']);
	//gulp.watch('./admin/config/generator.json', ['wait','inject:after']);
});
 gulp.watch('templates/*.tmpl.html', ['build']);


gulp.task('merge:items', function () {
return gulp.src(itemList)
    .pipe(merge({
		startObj: [],
        fileName: 'items.json',
		concatArrays:true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('merge:posts', function () {
return gulp.src(postList)
    .pipe(merge({
		startObj: [],
        fileName: 'posts.json',
		concatArrays:true
    }))
    .pipe(gulp.dest('./dist'));
});



//default server with nodemon and watch
gulp.task("default", ["WATCH"], function() {
	//console.log(chalk.blue('Server listening with tasks:'),chalk.green(' Start'),chalk.red(' &&'),chalk.green(' Watch'))
});