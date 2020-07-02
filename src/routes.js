const { Router } = require('express')

const routes = new Router()

routes.get('/', (_, res) => res.render('_layout/default'))

module.exports = routes
