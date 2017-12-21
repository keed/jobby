const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser(function(user, done) {
  console.log('serializeUser')
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser')
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ userName: username }, function (err, user) {
      if (err) { console.log(err); return done(err); }
      if (!user) {
        console.log('Incorrect username.')
        return done(null, false, { message: 'Incorrect username.' });
      }
      else if (!user.validPassword(password)) {
        console.log('Incorrect password.')
        return done(null, false, { message: 'Incorrect password.' });
      }
      else {
        return done(null, user);
      }
    });
  }
));

module.exports = passport
