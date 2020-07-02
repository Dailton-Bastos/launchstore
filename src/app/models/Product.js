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
}
