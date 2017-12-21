const User = require('../models/user');

exports.index = (req,res) => {
  res.render('index')
}

exports.home = (req,res) => {
  res.render('home/index')
}
