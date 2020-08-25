const db = require('../../config/database')

const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
  ...Base,

  async files(id) {
    const query = 'SELECT * FROM files WHERE product_id = $1'

    const results = await db.query(query, [id])

    return results.rows
  },

  async search({ filter, category }) {
    let query = `
      SELECT products.*,
      categories.name AS category_name
      FROM products
      LEFT JOIN categories
      ON (categories.id = products.category_id)
      WHERE 1 = 1
    `

    if (category) {
      query += ` AND products.category_id = ${category}`
    }

    if (filter) {
      query += `
        AND (products.name ILIKE '%${filter}%'
        OR products.description ILIKE '%${filter}%')
      `
    }

    query += ` AND status != 0 ORDER BY products.name`

    const results = await db.query(query)
    return results.rows
  },
}
