const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)
const db = require('./database')

module.exports = session({
  store: new PgSession({
    pool: db,
  }),
  name: 'root',
  secret: 'MyAppSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
  },
})
