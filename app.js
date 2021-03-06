var express = require('express');
const createError = require('http-errors');
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/books',booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = createError(404);
  error.message = "The requested page was not found";
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // render the error page
  res.status(err.status || 500);

  if(err.status == 404)
    res.render('page-not-found');
  else  
    res.render('error');
});

module.exports = app;
