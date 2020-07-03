const { Router } = require('express')

const routes = new Router()

const ProductController = require('./app/controllers/ProductController')

routes.get('/', (_, res) => res.render('_layout/default'))

// Products
routes.get('/products/create', ProductController.create)
routes.get('/products/:id/edit', ProductController.edit)
routes.post('/products', ProductController.post)
routes.put('/products', ProductController.put)
routes.delete('/products', ProductController.delete)

// Ads
routes.get('/ads/create', (_, res) => res.redirect('/products/create'))

module.exports = routes
