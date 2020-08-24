const db = require('../../config/database')

const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
  ...Base,

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

// create(data) {
//   const query = `
//     INSERT INTO products (
//       category_id,
//       user_id,
//       name,
//       description,
//       old_price,
//       price,
//       quantity,
//       status
//     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING id
//   `

//   const {
//     category_id,
//     user_id,
//     name,
//     description,
//     old_price,
//     quantity,
//     status,
//   } = data

//   let { price } = data
//   price = price.replace(/\D/g, '')

//   const values = [
//     category_id,
//     user_id,
//     name,
//     description,
//     old_price || price,
//     price,
//     quantity,
//     status || 1,
//   ]

//   return db.query(query, values)
// },
