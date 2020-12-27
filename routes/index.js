//引用Express與Express路由器
const express = require('express')
const router = express.Router()
//準備引入路由模組
const home = require('./modules/home')
router.use('/', home)

const restaurants = require('./modules/restaurants')
router.use('/restaurants', restaurants)
//匯出路由器
module.exports = router
