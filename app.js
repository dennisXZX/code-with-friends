const cookieParser = require('cookie-parser');
const express = require('express');
const expressValidator = require('express-validator');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');

const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

require('./passport')
const config = require('./config')

// import routes
const homeRouter = require('./routes/home');
const aboutRouter = require('./routes/about');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');

mongoose.connect(config.dbConnstring)
global.User = require('./models/user')
global.Task = require('./models/task')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// apply middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

// store the user after authentication
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
  }

  next()
})

// apply app routers
app.use(homeRouter);
app.use(aboutRouter);
app.use(contactRouter);
app.use(authRouter);
app.use(taskRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/error');
});

module.exports = app;
