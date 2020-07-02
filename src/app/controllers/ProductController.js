const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
  create(_, res) {
    // Promisse
    Category.all()
      .then((results) => {
        const categories = results.rows
        return res.render('products/create', { categories })
      })
      .catch((err) => {
        throw new Error(err)
      })
  },

  async post(req, res) {
    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('All fields required')

    let results = await Product.create(req.body)
    const productId = results.rows[0].id

    results = await Category.all()
    const categories = results.rows

    return res.render('products/create', { productId, categories })
  },
}
