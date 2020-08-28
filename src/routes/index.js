const { Router } = require('express')

const routes = new Router()

const HomeController = require('../app/controllers/HomeController')

const products = require('./products')
const users = require('./users')
const cart = require('./cart')

routes.get('/', HomeController.index)

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)

// Ads
routes.get('/ads/create', (_, res) => res.redirect('/products/create'))

// Accounts
routes.get('/accounts', (_, res) => res.redirect('/users/login'))

module.exports = routes
