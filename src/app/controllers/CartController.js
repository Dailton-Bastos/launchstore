const Cart = require('../../libs/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      let { cart } = req.session

      cart = Cart.init(cart)

      return res.render('cart/index', { cart })
    } catch (error) {
      throw new Error(error)
    }
  },

  async addOne(req, res) {
    try {
      const { id } = req.params

      const product = await LoadProductService.load('product', {
        where: { id },
      })

      let { cart } = req.session

      cart = Cart.init(cart).addOne(product)

      req.session.cart = cart

      return res.redirect('/cart')
    } catch (error) {
      throw new Error(error)
    }
  },
}
