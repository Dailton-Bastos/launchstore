const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')

const { formatCpfCnpj, formatZipCode } = require('../../libs/utils')

module.exports = {
  registerForm(_, res) {
    return res.render('user/register')
  },

  async show(req, res) {
    try {
      const { user } = req

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
      user.zip_code = formatZipCode(user.zip_code)

      return res.render('user/index', { user })
    } catch (error) {
      throw new Error(error)
    }
  },

  async post(req, res) {
    try {
      const { name, email, address } = req.body

      let { password, cpf_cnpj, zip_code } = req.body

      password = await hash(password, 8)

      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      zip_code = zip_code.replace(/\D/g, '')

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
    } catch (error) {
      throw new Error(error)
    }
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
    try {
      const { id } = req.body

      // Get all products
      const products = await Product.findAll({ where: { user_id: id } })

      // Get all products images
      const allFilesPromise = products.map((product) => {
        return Product.files(product.id)
      })

      const promiseResults = await Promise.all(allFilesPromise)

      // Delete user
      await User.delete(id)
      req.session.destroy()

      // Remove all imagens public folder
      promiseResults.forEach((files) => {
        return files.rows.forEach((file) => {
          try {
            if (file) unlinkSync(file.path)
          } catch (error) {
            throw new Error(error)
          }
        })
      })

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
