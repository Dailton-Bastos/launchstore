const db = require('../../config/database')

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid Params')

    this.table = table

    return this
  },

  async findOne(filters) {
    let query = `SELECT * FROM ${this.table}`

    Object.keys(filters).map((key) => {
      query = `${query} ${key}`

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`
        return query
      })
      return query
    })

    const results = await db.query(query)

    return results.rows[0]
  },

  async create(fields) {
    const keys = []
    const values = []

    try {
      Object.keys(fields).forEach((key) => {
        keys.push(key)
        values.push(fields[key])
      })

      const query = `
          INSERT INTO ${this.table} (${keys.join(',')})
          VALUES (${values.join(',')})
        `

      const results = await db.query(query)
      return results.rows[0].id
    } catch (error) {
      throw new Error(error)
    }
  },

  update(id, fields) {
    const update = []

    try {
      Object.keys(fields).forEach((key) => {
        const line = `${key} = '${fields[key]}'`
        update.push(line)
      })

      const query = `
        UPDATE ${this.table} SET
        ${update.join(',')} WHERE id = ${id}
      `

      return db.query(query)
    } catch (error) {
      throw new Error(error)
    }
  },

  delete(id) {
    const query = 'DELETE FROM products WHERE id = $1'

    return db.query(query, [id])
  },
}

module.exports = Base
