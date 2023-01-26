//Express
require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const session = require('cookie-session');
const passport = require("./passport.js");

const mongoose = require("mongoose");
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
app.use(helmet());

const mongoDb = process.env.MONGODB_URI;
mongoose.set('strictQuery', true)
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
//You prob dont need it 
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
