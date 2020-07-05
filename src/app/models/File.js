const { unlinkSync } = require('fs')
const db = require('../../config/database')

module.exports = {
  create({ filename, path, product_id }) {
    const query = `
      INSERT INTO files (
        name,
        path,
        product_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `
    const values = [filename, path, product_id]

    return db.query(query, values)
  },

  async delete(id) {
    try {
      const result = await db.query('SELECT * FROM files WHERE id = $1', [id])
      const file = result.rows[0]

      unlinkSync(file.path)

      const query = 'DELETE FROM files WHERE id = $1'

      return db.query(query, [id])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return this
  },
}
