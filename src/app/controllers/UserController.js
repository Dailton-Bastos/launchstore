const User = require('../models/User')
const { formatCpfCnpj, formatZipCode } = require('../../libs/utils')

module.exports = {
  registerForm(_, res) {
    return res.render('user/register')
  },

  async show(req, res) {
    const { user } = req

    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.zip_code = formatZipCode(user.zip_code)

    return res.render('user/index', { user })
  },

  async post(req, res) {
    const { name, email, password, cpf_cnpj, zip_code, address } = req.body

    const userId = await User.create({
      name,
      email,
      password,
      cpf_cnpj,
      zip_code,
      address,
    })

    req.session.userId = userId

    return res.redirect('/users')
  },

  async update(req, res) {
    try {
      const { user } = req

      const { name, email, address } = req.body

      let { cpf_cnpj, zip_code } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      zip_code = zip_code.replace(/\D/g, '')

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        zip_code,
        address,
      })

      return res.render('user/index', {
        user: req.body,
        success: 'Conta atualizada com sucesso',
      })
    } catch (error) {
      console.error(error)
      return res.render('user/index', {
        error: 'Algum erro aconteceu',
      })
    }
  },

  async delete(req, res) {
    const { id } = req.body
    try {
      await User.delete(id)

      req.session.destroy()

      return res.render('session/login', {
        success: 'Conta deletada com sucesso',
      })
    } catch (error) {
      console.error(error)
      return res.render('user/index', {
        user: req.body,
        error: 'Erro ao tentar deletar sua conta',
      })
    }
  },
}
