const db = require('../../config/database')

module.exports = {
  all() {
    const query = 'SELECT * FROM products ORDER BY updated_at DESC'

    return db.query(query)
  },
  create(data) {
    const query = `
      INSERT INTO products (
        category_id,
        user_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `

    const {
      category_id,
      user_id,
      name,
      description,
      old_price,
      quantity,
      status,
    } = data

    let { price } = data
    price = price.replace(/\D/g, '')

    const values = [
      category_id,
      user_id,
      name,
      description,
      old_price || price,
      price,
      quantity,
      status || 1,
    ]

    return db.query(query, values)
  },

  find(id) {
    const query = 'SELECT * FROM products WHERE id = $1'

    return db.query(query, [id])
  },

  update(data) {
    const query = `
      UPDATE products SET
        category_id = ($1),
        user_id = ($2),
        name = ($3),
        description = ($4),
        old_price = ($5),
        price = ($6),
        quantity = ($7),
        status = ($8)
      WHERE id = $9
    `
    const {
      category_id,
      user_id,
      name,
      description,
      old_price,
      price,
      quantity,
      status,
      id,
    } = data

    const values = [
      category_id,
      user_id || 1,
      name,
      description,
      old_price,
      price,
      quantity,
      status,
      id,
    ]

    return db.query(query, values)
  },

  delete(id) {
    const query = 'DELETE FROM products WHERE id = $1'

    return db.query(query, [id])
  },

  files(id) {
    const query = 'SELECT * FROM files WHERE product_id = $1'

    return db.query(query, [id])
  },

  search(params) {
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

    return db.query(query)
  },
}
