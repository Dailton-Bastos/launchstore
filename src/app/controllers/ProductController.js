const Category = require('../models/Category')
const Product = require('../models/Product')

const { formatPrice } = require('../../libs/utils')

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

    const results = await Product.create(req.body)
    const { id } = results.rows[0]

    return res.redirect(`/products/${id}`)
  },

  async edit(req, res) {
    const { id } = req.params

    let results = await Product.find(id)
    const product = results.rows[0]

    if (!product) return res.send('Product not found')

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)

    results = await Category.all()
    const categories = results.rows

    return res.render('products/edit', { product, categories })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('All fields required')

    req.body.price = req.body.price.replace(/\D/g, '')

    const { old_price, price, id } = req.body

    if (old_price !== price) {
      const oldProduct = await Product.find(id)
      req.body.old_price = oldProduct.rows[0].price
    }

    await Product.update(req.body)

    return res.redirect(`/products/${id}/edit`)
  },

  async delete(req, res) {
    const { id } = req.body

    await Product.delete(id)

    return res.redirect('/products/create')
  },
}
