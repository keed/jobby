const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const expressValidator = require('express-validator')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const passport = require('passport');
const port = 3000


const routes = require('./routes/routes')
const dbConfig = require('./config/dbConfig')

const app = express()
//==================== Config ====================
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.urlLive, {
  useMongoClient: true
}).then (
  () => {
    console.log("-- Mongoose ok --")
  },
  (err) => {
    console.log(err)
  }
)

app.use(cookieParser()) //read cokies (needed for auth)
app.use(bodyParser.json()) //get information from html files
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', exphbs({defaultLayout:'main'}))
app.set('view engine', 'handlebars')
//==================== Session ====================
app.use(session({
  secret: 'wdi13classof2017',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//==================== Flash Messages for express ====================
app.use(flash());
app.use((req, res, next) => {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//==================== Express Validator ====================
app.use(expressValidator({
  errorFormatter : (param, msg, value) => {
      let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root

        while(namespace.length){
          formParam += '['+ namespace.shift()+ ']'
        }

        return {
          param : formParam,
          msg : msg,
          value : value
        }
    }
}))

//==================== Routes ====================
app.use('/',routes)


app.listen(port, () => {
  console.log('---Server Started---')
})
