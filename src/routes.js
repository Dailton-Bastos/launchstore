const { Router } = require('express')

const routes = new Router()

const ProductController = require('./app/controllers/ProductController')

routes.get('/', (_, res) => res.render('_layout/default'))

// Products
routes.get('/products/create', ProductController.create)
routes.post('/products', ProductController.post)

// Ads
routes.get('/ads/create', (_, res) => res.redirect('/products/create'))

module.exports = routes
