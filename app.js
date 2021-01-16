//require packages used in the project
const express = require('express')
const bodyParser = require('body-parser')
const hdb = require('handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')

require('./config/mongoose')

const app = express()
const port = 3000

hdb.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//require express-handlebars here
const exphbs = require('express-handlebars')


//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(session({
  secret: 'ThisIsMyBigSecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)



// Start and listen the server
app.listen(port, () => {
  console.log('This server has be started')
})