const express = require('express')
const router = express.Router()

const passport = require('../helpers/ppInformation')
const isLoggedIn = require('../helpers/loginBlock')
const homeController = require('../controllers/homeController')
const authController = require('../controllers/authController')

//==================== Home non auth access ====================
router.get('/', homeController.index)
router.get('/home',isLoggedIn,homeController.home)


//==================== Auth access ====================
router.get('/auth/login', authController.login)
router.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/home',
                        failureRedirect: '/auth/login',
                        failureFlash: 'Invalid username and/or password',
                        successFlash: 'Logged in successfully'}))
router.get('/auth/register', authController.register)
router.post('/auth/register', authController.postRegister)
router.get('/auth/logout', authController.logout)

module.exports = router
