const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

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

    if (req.files.length === 0)
      return res.send('Please, send at least one image')

    const results = await Product.create(req.body)
    const { id } = results.rows[0]

    const filesPromise = req.files.map((file) => {
      return File.create({ ...file, product_id: id })
    })

    await Promise.all(filesPromise)

    return res.redirect(`/products/${id}/edit`)
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

    // get images
    results = await Product.files(product.id)
    let files = results.rows
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}`,
    }))

    return res.render('products/edit', { product, categories, files })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    keys.forEach((key) => {
      const isValid = req.body[key] === '' && key !== 'removed_files'
      if (isValid) return res.send('All fields required')
      return isValid
    })

    const { removed_files, id } = req.body

    // Atualizando images no DB
    let newFilesPromise = []

    if (req.files.length !== 0) {
      newFilesPromise = req.files.map((file) => {
        return File.create({ ...file, product_id: id })
      })
    }

    await Promise.all(newFilesPromise)

    if (removed_files) {
      const removedFiles = removed_files.split(',')
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map((file_id) => {
        return File.delete(file_id)
      })

      await Promise.all(removedFilesPromise)
    }

    req.body.price = req.body.price.replace(/\D/g, '')

    const { old_price, price } = req.body

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
