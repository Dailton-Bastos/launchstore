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

  removeOne(req, res) {
    const { id } = req.params

    let { cart } = req.session

    if (!cart) return res.redirect('/cart')

    cart = Cart.init(cart).removeOne(id)

    req.session.cart = cart

    return res.redirect('/cart')
  },

  delete(req, res) {
    const { id } = req.params
    const { cart } = req.session

    if (!cart) return false

    req.session.cart = Cart.init(cart).delete(id)

    return res.redirect('/cart')
  },
}
