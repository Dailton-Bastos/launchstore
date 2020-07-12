const User = require('../models/User')

module.exports = {
  registerForm(_, res) {
    return res.render('user/register')
  },

  show(_, res) {
    return res.send('OK user create')
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

    return res.redirect('/users')
  },
}
