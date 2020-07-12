const User = require('../models/User')

async function post(req, res, next) {
  const keys = Object.keys(req.body)
  const isValid = keys.every((key) => req.body[key] !== '')

  if (!isValid) {
    return res.render('user/register', {
      user: req.body,
      error: 'Por favor preencha todos os campos',
    })
  }

  const { email, password, passwordRepeat } = req.body

  let { cpf_cnpj } = req.body

  cpf_cnpj = cpf_cnpj.replace(/\D/g, '')

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj },
  })

  if (user) {
    return res.render('user/register', {
      user: req.body,
      error: 'Usuário já cadastrado',
    })
  }

  if (password !== passwordRepeat) {
    return res.render('user/register', {
      user: req.body,
      error: 'A senha e a confirmação de senha estão incorretas',
    })
  }

  return next()
}

module.exports = {
  post,
}
