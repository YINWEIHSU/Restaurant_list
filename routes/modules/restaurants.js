const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
    return res.render('new')
  })

  router.get('/:restaurants_id', (req, res) => {
    const id = req.params.restaurants_id
    return Restaurant.findById(id)
      .lean()
      .then((restaurant) => res.render('show', { restaurant }))
      .catch(error => console.log(error))
  })

  router.post('/', (req, res) => {
    const {name, name_en, category, image, location, phone, description} = req.body
    //預設評分為4.5
    const rating = 4.5
    return Restaurant.create({ name, name_en, category, image, location, phone, description, rating })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

  router.get('/:restaurant_id/edit', (req, res) => {
    const id = req.params.restaurant_id
    return Restaurant.findById(id)
      .lean()
      .then((restaurant) => res.render('edit', { restaurant }))
      .catch(error => console.log(error))
  })

  

  router.put('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    const {name, name_en, category, image, location, phone, description} = req.body
    return Restaurant.findById(id)
      .then(restaurant => {
        restaurant.name = name
        restaurant.name_en = name_en
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

  router.delete('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    return Restaurant.findById(id)
      .then(restaurant => restaurant.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

  module.exports = router