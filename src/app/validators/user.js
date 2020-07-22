const { compare } = require('bcryptjs')
const User = require('../models/User')

function checkAllFields(body) {
  const keys = Object.keys(body)
  const isValid = keys.every((key) => body[key] !== '')

  if (!isValid) {
    return {
      user: body,
      error: 'Por favor preencha todos os campos',
    }
  }

  return !isValid
}

async function show(req, res, next) {
  const { userId: id } = req.session

  const user = await User.findOne({ where: { id } })

  if (!user) {
    return res.render('user/register', {
      error: 'Usuário não encontrado',
    })
  }

  req.user = user

  return next()
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body)

  if (fillAllFields) return res.render('user/register', fillAllFields)

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

async function update(req, res, next) {
  const fillAllFields = checkAllFields(req.body)

  if (fillAllFields) return res.render('user/index', { fillAllFields })

  const { id, password } = req.body

  if (!password) {
    return res.render('user/index', {
      user: req.body,
      error: 'Coloque sua senha para atualizar seu cadastro',
    })
  }

  const user = await User.findOne({ where: { id } })

  const passed = await compare(password, user.password)

  if (!passed) {
    return res.render('user/index', {
      user: req.body,
      error: 'Senha incorreta',
    })
  }

  req.user = user

  return next()
}

module.exports = {
  post,
  show,
  update,
}
