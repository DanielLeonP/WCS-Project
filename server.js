const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessions = require('express-session');
const bodyParser = require('body-parser');


const app = express();



// const database = require("./config/database/db.js");
// db = database.conectar();
// db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
  secret: "proyectoAPSWCS123",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));


app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use(require('./routes/paypal'));
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/declaraciones'));
// app.use(require('./routes/files'));
app.use(require('./routes/pdf'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});

module.exports = app;