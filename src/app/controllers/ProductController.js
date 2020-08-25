const { unlinkSync } = require('fs')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async create(_, res) {
    try {
      const categories = await Category.findAll()

      return res.render('products/create', { categories })
    } catch (error) {
      throw new Error(error)
    }
  },

  async post(req, res) {
    try {
      const keys = Object.keys(req.body)
      const isValid = keys.every((key) => req.body[key] !== '')

      if (!isValid) res.send('All fields required')

      if (req.files.length === 0)
        return res.send('Please, send at least one image')

      const {
        category_id,
        name,
        description,
        old_price,
        quantity,
        status,
      } = req.body

      let { price } = req.body
      price = price.replace(/\D/g, '')

      const product_id = await Product.create({
        category_id,
        user_id: req.session.userId,
        name,
        description,
        old_price: old_price || price,
        price,
        quantity,
        status: status || 1,
      })

      const filesPromise = req.files.map((file) => {
        return File.create({ name: file.filename, path: file.path, product_id })
      })

      await Promise.all(filesPromise)

      return res.redirect(`/products/${product_id}/edit`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params

      const product = await LoadProductService.load('product', {
        where: { id },
      })

      return res.render('products/show', { product })
    } catch (error) {
      throw new Error(error)
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params

      const product = await LoadProductService.load('product', {
        where: { id },
      })

      const categories = await Category.findAll()

      return res.render('products/edit', { product, categories })
    } catch (error) {
      throw new Error(error)
    }
  },

  async put(req, res) {
    try {
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
      req.body.old_price = req.body.old_price.replace(/\D/g, '')

      const { old_price, price } = req.body

      if (old_price !== price) {
        const oldProduct = await Product.find(id)
        req.body.old_price = oldProduct.price
      }

      const { category_id, name, description, quantity, status } = req.body

      await Product.update(id, {
        category_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status,
      })

      return res.redirect(`/products/${id}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id } = req.body

    const files = await Product.files(id)

    await Product.delete(id)

    files.forEach((file) => {
      try {
        if (file) unlinkSync(file.path)
      } catch (error) {
        throw new Error(error)
      }
    })

    return res.redirect('/products/create')
  },
}
