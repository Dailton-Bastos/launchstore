const db = require('../../config/database')

module.exports = {
  all() {
    const query = 'SELECT * FROM categories'

    return db.query(query)
  },
}
