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

  async search(params) {
    const { filter, category } = params

    let query = ''
    let filterQuery = 'WHERE'

    if (category) {
      filterQuery = `${filterQuery}
        products.category_id = ${category}
        AND`
    }

    filterQuery = `
      ${filterQuery}
      products.name ILIKE '%${filter}%'
      OR products.description ILIKE '%${filter}%'
    `

    query = `
      SELECT products.*,
      categories.name AS category_name
      FROM products
      LEFT JOIN categories
      ON (categories.id = products.category_id)
      ${filterQuery}
      ORDER BY products.id
    `

    const results = await db.query(query)
    return results.rows
  },
}
