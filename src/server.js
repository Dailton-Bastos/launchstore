const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const { resolve } = require('path')
const session = require('./config/session')
const routes = require('./routes')

const PORT = process.env.NODE_PORT || 3333
const isDev = process.env.NODE_ENV !== 'production'

const server = express()

server.use(session)
// Global Variable
server.use((req, res, next) => {
  res.locals.session = req.session
  return next()
})
server.use(express.urlencoded({ extended: true }))
server.use(express.static(resolve(__dirname, '..', 'public')))
server.use(methodOverride('_method', { methods: ['POST', 'GET'] }))

server.set('view engine', 'njk')
nunjucks.configure(resolve(__dirname, 'app', 'views'), {
  express: server,
  watch: isDev,
  noCache: true,
  autoescape: false,
})

server.use(routes)

server.listen(PORT)
