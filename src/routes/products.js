const { Router } = require('express')
const multer = require('../app/middlewares/multer')

const routes = new Router()

const SearchController = require('../app/controllers/SearchController')
const ProductController = require('../app/controllers/ProductController')

const { onlyUsers } = require('../app/middlewares/session')

const { post, put } = require('../app/validators/product')

routes.get('/search', SearchController.index)

routes.get('/create', onlyUsers, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit)

routes.post(
  '/',
  onlyUsers,
  multer.array('photos', 6),
  post,
  ProductController.post
)
routes.put(
  '/',
  onlyUsers,
  multer.array('photos', 6),
  put,
  ProductController.put
)
routes.delete('/', onlyUsers, ProductController.delete)

module.exports = routes
