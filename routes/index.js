//引用Express與Express路由器
const express = require('express')
const router = express.Router()
//準備引入路由模組
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')


router.use('/users', users)
router.use('/restaurants', restaurants)
router.use('/', home)


//匯出路由器
module.exports = router
