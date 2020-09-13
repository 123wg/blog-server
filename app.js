var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('express-cors')
 

var articleRouter = require('./routes/article');
var usersRouter = require('./routes/users');
var fileRouter = require('./routes/file');
var typeRouter = require('./routes/type');
var tokenRouter = require('./routes/token');
var app = express();
// /设置允许跨域访问该服务.
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next();
// });

// 数据库引入
//  连接数据库
const db = require('./db/connection.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors({
  allowedOrigins: [
      'localhost:8080',
      'localhost:8886',
      'http://192.168.3.9:8886',
      'http://121.196.197.195:8886'
  ]
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/article', articleRouter);
app.use('/user', usersRouter);
app.use('/file',fileRouter);
app.use('/type',typeRouter);
app.use('/token',tokenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
