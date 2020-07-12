const { hash } = require('bcryptjs')
const db = require('../../config/database')

module.exports = {
  async findOne(filters) {
    let query = 'SELECT * FROM users'

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

  async create(data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        cpf_cnpj,
        zip_code,
        address
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

      const { name, email, password, address } = data

      let { cpf_cnpj, zip_code } = data

      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      zip_code = zip_code.replace(/\D/g, '')

      const passwordHash = await hash(password, 8)

      const values = [name, email, passwordHash, cpf_cnpj, zip_code, address]

      const results = await db.query(query, values)

      return results.rows[0].id
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return this
  },
}
