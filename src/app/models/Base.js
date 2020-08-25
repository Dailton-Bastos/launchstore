const db = require('../../config/database')

function find(filters, table) {
  let query = `SELECT * FROM ${table}`

  if (filters) {
    Object.keys(filters).forEach((key) => {
      query += ` ${key}`

      Object.keys(filters[key]).forEach((field) => {
        query += ` ${field} = '${filters[key][field]}'`
      })
    })
  }

  return db.query(query)
}

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid Params')

    this.table = table

    return this
  },

  async find(id) {
    const results = await find({ where: { id } }, this.table)

    return results.rows[0]
  },

  async findOne(filters) {
    const results = await find(filters, this.table)

    return results.rows[0]
  },

  async findAll(filters) {
    const results = await find(filters, this.table)

    return results.rows
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
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  },
}

module.exports = Base
