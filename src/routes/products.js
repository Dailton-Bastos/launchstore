const { Router } = require('express')
const multer = require('../app/middlewares/multer')

const routes = new Router()

const SearchController = require('../app/controllers/SearchController')
const ProductController = require('../app/controllers/ProductController')

routes.get('/search', SearchController.index)

routes.get('/create', ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit)
routes.post('/', multer.array('photos', 6), ProductController.post)
routes.put('/', multer.array('photos', 6), ProductController.put)
routes.delete('/', ProductController.delete)

module.exports = routes
