const passport = require('../helpers/ppInformation')
const User = require('../models/user');

exports.login = (req,res) => {
  res.render('auth/login')
}

// Post Login
exports.postLogin = (req,res) => {
  res.render('auth/login')
}

exports.register = (req,res) => {
  res.render('auth/register')
}

exports.logout = (req,res) => {
  req.logout()
  req.flash('success', 'You are now logged out!')
  res.redirect('/auth/login')
}

// Post register
exports.postRegister = (req,res) => {
  req.checkBody('firstName', 'First Name cannot be empty').notEmpty()
  req.checkBody('lastName', 'Last Name cannot be empty').notEmpty()
  req.checkBody('userName', 'Username cannot be empty').notEmpty()
  req.checkBody('email', 'Email cannot be empty').notEmpty()
  req.checkBody('password', 'Password cannot be empty').notEmpty()
  req.checkBody('password2', 'Password cannot be empty').notEmpty()
  req.checkBody('password', 'Passwords are not the same').equals(req.body.password2)
  let errors = req.validationErrors()
  if (errors) {
    res.render('auth/register',{errors:errors})
  }
  else {
    User.create({
      email : req.body.firstName,
      password : req.body.password,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      userName : req.body.userName
    }, (err, createdUser) => {
      if (err) {
        console.log(err)
        req.flash('error', 'User exists')
        res.redirect('/auth/register')
      } else {
        passport.authenticate('local',
        { successRedirect: '/home', successFlash : 'Account created and logged in'})
        (req,res);
      }
    }) //end err
  } //end else
}
