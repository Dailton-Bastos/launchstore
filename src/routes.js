const { Router } = require('express')

const routes = new Router()

routes.get('/', (_, res) => res.send('OK'))

module.exports = routes
