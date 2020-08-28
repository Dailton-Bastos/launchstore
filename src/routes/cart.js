const { Router } = require('express')

const routes = new Router()

const CartController = require('../app/controllers/CartController')

routes.get('/', CartController.index)
routes.post('/:id/add-one', CartController.addOne)

module.exports = routes
