const express = require('express');
const path = require('path');
const fs = require('fs');
const memeye = require('./admin/middleware/memeye');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
var createHTML = require('./admin/modules/createHTML');
var createNJK = require('./admin/modules/createNJK');
var config = require('./admin/config/config.json');
const winston = require('winston');
const expressWinston = require('express-winston');
var minifyOutput = require('./admin/modules/minify/');
const gulp = require('gulp');
require('./gulpfile.js');
if (config.minifyOutput === true) {
const memeye = require('./admin/middleware/memeye');
}
const { Console } = require('console');

//var insert = require('./admin/modules/insert');

var index = require('./admin/routes/index');
var users = require('./admin/routes/users');

const app = express();

if (config.sysMonitor === true) {
memeye();
}

app.set('views', path.join(__dirname, 'admin'));
app.set('view engine', 'njk');
nunjucks.configure('admin/views', {
    autoescape: true,
	trimBlocks: true,
	lstripBlocks: true,
	watch: false,
	useCache: config.cache,
    express: app
});

nunjucks.installJinjaCompat();

if (config.minifyOutput === true) {
	//minify html output
	app.use(minifyOutput);
}


app.use(expressWinston.errorLogger({
  transports: [
	new winston.transports.Console({
	  json: true,
	  colorize: true
	}),
	new (winston.transports.File)({ filename: './.tmp/logs/winston.log' })
  ],
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
  ignoreRoute: function (req, res) { return false; }
}));

//app.use(favicon(path.join(__dirname, 'admin', 'public/app/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'admin/public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





const output = fs.createWriteStream('./.tmp/logs/stdout.log');
const errorOutput = fs.createWriteStream('./.tmp/logs/stderr.log');
// custom simple logger
const loggit = new Console(output, errorOutput);
// use it like console
loggit.log();
module.exports = app;
