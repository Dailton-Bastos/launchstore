const db = require('../../config/database')

module.exports = {
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
      user_id || 1,
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
}
