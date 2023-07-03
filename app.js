const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const mysql = require('mysql');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pokemonRouter = require('./routes/pokemontcg');
const singlecardRouter = require('./routes/singlecard');
const infoRouter = require('./routes/info');
const adminRouter = require('./routes/admin');
const topSeller = require('./routes/topSeller')

const config = require('./config')

const pokemon = require('pokemontcgsdk');

const connection = mysql.createPool({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database,
    port: config.mysql.port
});

pokemon.configure({
    apiKey: 'XXXXXXXXXXXX'
});

//global.sqlite3 = sqlite3;
global.db = connection;
global.pokemon = pokemon;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email']
    }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        if(config.use_database){

            db.query("SELECT * from user_info where user_id = "+profile.id ,function (err,rows){
                if(err) {
                    console.log(err)
                    throw err;
                }
                if(rows && rows.length === 0){
                    console.log("There is no such user, adding now");
                    var email = '';
                    var image = '';
                    if(typeof profile.emails === 'undefined' ){
                        email = 'prova@gmail.com';
                    }else {
                        email = profile.emails[0].value;
                    }

                    if(typeof profile.photos === 'undefined' ){
                        image = 'https://feedbackwebapp.herokuapp.com/images/logo.jpg';
                    }else {
                        image = profile.photos[0].value;
                    }
                    db.query("INSERT into user_info(user_id,user_email,user_name,user_profile) VALUES('"+profile.id+"','"+ email +"','"+profile.displayName+"','"+image+"')");
                }else{
                    if ( typeof profile.photos !== 'undefined'){
                        image = profile.photos[0].value;
                        db.query("UPDATE user_info SET user_profile = '" + image + "', user_name = '" + profile.displayName + "' WHERE user_id =  '"+profile.id+"' " );
                    }
                    console.log("User already exists in database");
                }
            });
        }
        return done(null, profile);
    })

    }
));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pokemontcg', pokemonRouter);
app.use('/singlecard', singlecardRouter);
app.use('/info',infoRouter);
app.use('/admin',adminRouter);
app.use('/topSeller',topSeller);

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
