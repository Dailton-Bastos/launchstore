const Cart = require('../../libs/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      const product = await LoadProductService.load('product', {
        where: { id: 13 },
      })

      let { cart } = req.query

      cart = Cart.init(cart).addOne(product)

      return res.render('cart/index', { cart })
    } catch (error) {
      throw new Error(error)
    }
  },
}
