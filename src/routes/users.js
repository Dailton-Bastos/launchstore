const { Router } = require('express')

const routes = new Router()

const UserController = require('../app/controllers/UserController')

const Validator = require('../app/validators/user')

routes.get('/register', UserController.registerForm)
routes.post('/register', Validator.post, UserController.post)

routes.get('/', Validator.show, UserController.show)
routes.put('/', Validator.update, UserController.update)

module.exports = routes
