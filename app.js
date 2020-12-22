//require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const hdb = require('handlebars')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

hdb.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

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

//route setting
app.get('/', (req, res) => {
  //creat a variable to store restaurantOne
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurants_id', (req, res) => {
  const id = req.params.restaurants_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/new', (req, res) => {
  return res.render('new')
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase().trim())
  })
  if (restaurants.length === 0) {
    res.render('index_noresult', { restaurants, keyword })
  } else {
    res.render('index', { restaurants, keyword })
  }
})

app.post('/', (req, res) => {
  const name = req.body.name
  const nameEn = req.body.name.en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const description = req.body.description
  return Restaurant.create({ name, nameEn, category, image, location, phone, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const name = req.body.name
  const nameEn = req.body.name.en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const description = req.body.description
  console.log(req.body)
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = nameEn
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

app.post('/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Start and listen the server
app.listen(port, () => {
  console.log('This server has be started')
})