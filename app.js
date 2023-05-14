const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const path = require('path');
const indexRouter = require('./routes/index');
const boardsRouter = require('./routes/stickieBoards');
const mongoose = require('mongoose');
const hbs = require('hbs');

mongoose
  .connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

var application = express();

// view engine setup
application.set('views', path.join(__dirname, 'views'));
application.set('view engine', 'hbs');

application.use(logger('dev'));
application.use(express.json());
application.use(express.urlencoded({ extended: false }));
application.use(cookieParser());
application.use(express.static(path.join(__dirname, 'public')));

application.use('/', indexRouter);
application.use('/boards', boardsRouter);

// catch 404 and forward to error handler
application.use((reqeust, response, next) => next(createError(404)));

// error handler
application
  .use(
      (error, request, response, next) => {
        // set locals, only providing error in development
        response.locals.message = error.message;
        response.locals.error = request.app.get('env') === 'development' ? error : {};

        // render the error page
        response.status(error.status || 500);
        response.render('error');
      }
    );

module.exports = application;



