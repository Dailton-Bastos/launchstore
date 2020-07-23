const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../libs/mailer')

const User = require('../models/User')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },

  login(req, res) {
    const { id } = req.user
    req.session.userId = id

    return res.redirect('/users')
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },

  forgotForm(req, res) {
    return res.render('session/forgot-password')
  },

  async forgot(req, res) {
    const { user } = req

    try {
      // User token
      const token = crypto.randomBytes(20).toString('hex')

      // User token expire 1 hour
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      })

      // Send email with a link to reset password
      await mailer.sendMail({
        to: user.email,
        from: 'no-replay@launchstoe.com.br',
        subject: 'Recuperação de senha',
        html: `<h2>Perdeu a chave?</h2>
          <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a
              href="http://localhost:3333/users/password-reset?token=${token}"
              target="_blank"
            >RECUPERAR SENHA</a>
          </p>
        `,
      })

      // Notify user to verify your email
      return res.render('session/forgot-password', {
        success: 'Verifique seu email para resetar sua senha',
      })
    } catch (error) {
      console.error(error)
      return res.render('session/forgot-password', {
        error: 'Error inesperado, tente novamente',
      })
    }
  },

  resetForm(req, res) {
    const { token } = req.query
    return res.render('session/password-reset', { token })
  },

  async reset(req, res) {
    const { user } = req
    const { password, token } = req.body

    try {
      // New password hash
      const newPassword = await hash(password, 8)

      // Update user
      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      return res.render('session/login', {
        user: req.body,
        success: 'Senha atualizada! Faça o seu login',
      })
    } catch (error) {
      console.error(error)
      return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Error inesperado, tente novamente',
      })
    }
  },
}
