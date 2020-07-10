const Product = require('../models/Product')

const { formatPrice } = require('../../libs/utils')

module.exports = {
  async index(req, res) {
    async function getImage(productId) {
      const results = await Product.files(productId)
      const files = results.rows.map((file) => {
        return `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`
      })

      return files[0]
    }

    try {
      const params = {}

      const { filter, category } = req.query

      if (!filter) return res.redirect('/')

      params.filter = filter

      if (category) params.category = category

      const results = await Product.search(params)

      const productsPromise = results.rows.map(async (product) => {
        product.img = await getImage(product.id)
        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        return product
      })

      const products = await Promise.all(productsPromise)

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
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return this
  },
}
