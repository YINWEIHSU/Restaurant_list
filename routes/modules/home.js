const express = require('express')
const router = express.Router()
//引用Restaurant model
const Restaurant = require('../../models/restaurant')
const restaurantList = require('../../restaurant.json')
//定義首頁路由
router.get('/', (req, res) => {
  //creat a variable to store restaurantOne
  const sort = req.query.sort || 'name'
  const sortWay = {
    name: { name_en: 'asc' },
    nameDesc: { name_en: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(sortWay[sort])
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
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

//匯出路由模組
module.exports = router