const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductService.load('products')
      const products = allProducts.filter((_, index) => !(index > 2))

      return res.render('home/index', { products })
    } catch (error) {
      throw new Error(error)
    }
  },
}
