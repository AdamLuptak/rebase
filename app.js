var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var i18n = require('i18n');
var exphbs  = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser     = require('body-parser');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

var app = express();

// app.use(require('connect-livereload')({
//   ignore:['.xlsx']
// }));

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'index',
  helpers: {
    __: function() { return i18n.__.apply(this, arguments); },
    __n: function() { return i18n.__n.apply(this, arguments); }
  }
}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

i18n.configure({
  locales: ['hu', 'en'],
  fallbacks: {'en': 'hu'},
  defaultLocale: 'hu',
  cookie: 'locale',
  queryParameter: 'lang',
  directory: __dirname + '/locales',
  directoryPermissions: '755',
  autoReload: true,
  updateFiles: true,
  api: {
    '__': '__',  //now req.__ becomes req.__
    '__n': '__n' //and req.__n can be called as req.__n
  }
});
app.use(i18n.init);

app.get('/hu', function (req, res) {
  res.cookie('locale', 'hu', { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});
// http://127.0.0.1:3000/en
app.get('/en', function (req, res) {
  res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
