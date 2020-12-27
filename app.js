//require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser')
const hdb = require('handlebars')
const methodOverride = require('method-override') 
const routes = require('./routes')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

hdb.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//require express-handlebars here
const exphbs = require('express-handlebars')


db.on('error', () => {
  console.log('mongdb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//route setting

// Start and listen the server
app.listen(port, () => {
  console.log('This server has be started')
})