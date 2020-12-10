//require packages used in the project
const express = require('express')
const app = express()
const port = 3000

//require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

//route setting
app.get('/', (req, res) => {
  //creat a variable to store restaurantOne
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurants_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurants_id)
  res.render("show", { restaurant })
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

// Start and listen the server
app.listen(port, () => {
  console.log('This server has be started')
})