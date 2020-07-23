const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.render('session/login', {
      user: req.body,
      error: 'Usuário não encontrado',
    })
  }

  const passed = await compare(password, user.password)

  if (!passed) {
    return res.render('session/login', {
      user: req.body,
      error: 'Senha incorreta',
    })
  }

  req.user = user

  return next()
}

async function forgot(req, res, next) {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.render('session/forgot-password', {
      user: req.body,
      error: 'Email não cadastrado',
    })
  }

  req.user = user

  return next()
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  const user = await User.findOne({ where: { email } })

  const { reset_token, reset_token_expires } = user

  if (!user) {
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Email não cadastrado',
    })
  }

  if (password !== passwordRepeat) {
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'A senha e a confirmação de senha estão incorretas',
    })
  }

  if (token !== reset_token) {
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Token inválido! Solicite uma nova recuperação de senha.',
    })
  }

  let now = new Date()
  now = now.setHours(now.getHours())

  if (now > reset_token_expires) {
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Token expirado! Solicite nova recuperação de senha.',
    })
  }

  req.user = user

  return next()
}

module.exports = {
  login,
  forgot,
  reset,
}
