const { Router } = require('express')
const multer = require('./app/middlewares/multer')

const routes = new Router()

const ProductController = require('./app/controllers/ProductController')

routes.get('/', (_, res) => res.render('_layout/default'))

// Products
routes.get('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit)
routes.post('/products', multer.array('photos', 6), ProductController.post)
routes.put('/products', multer.array('photos', 6), ProductController.put)
routes.delete('/products', ProductController.delete)

// Ads
routes.get('/ads/create', (_, res) => res.redirect('/products/create'))

module.exports = routes
