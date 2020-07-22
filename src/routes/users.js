const { Router } = require('express')

const routes = new Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const {
  isLoggedRedirectToUsers,
  onlyUsers,
} = require('../app/middlewares/session')

routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/', onlyUsers, UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

module.exports = routes
