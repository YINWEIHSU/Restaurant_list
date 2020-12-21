const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.log('mongdb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < restaurantList.results.length; i++) {
    Restaurant.create(restaurantList.results[i])
  }
  console.log('done')
})
