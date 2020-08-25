const Product = require('../models/Product')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      const params = {}

      const { filter, category } = req.query

      if (!filter) return res.redirect('/')

      params.filter = filter

      if (category) params.category = category

      let products = await Product.search(params)

      const productsPromise = products.map(LoadProductService.format)

      products = await Promise.all(productsPromise)

      const search = {
        term: filter,
        total: products.length,
      }

      const categories = products
        .map((product) => ({
          id: product.category_id,
          name: product.category_name,
        }))
        .reduce((categoriesFiltered, currentCategory) => {
          const found = categoriesFiltered.some(
            (cat) => cat.id === currentCategory.id
          )

          if (!found) categoriesFiltered.push(currentCategory)

          return categoriesFiltered
        }, [])

      return res.render('search/index', { products, search, categories })
    } catch (error) {
      throw new Error(error)
    }
  },
}
