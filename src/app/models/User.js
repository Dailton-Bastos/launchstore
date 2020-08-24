const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
  ...Base,
}

// async create(data) {
//   try {
//     const query = `
//     INSERT INTO users (
//       name,
//       email,
//       password,
//       cpf_cnpj,
//       zip_code,
//       address
//     ) VALUES ($1, $2, $3, $4, $5, $6)
//     RETURNING id
//   `

//     const { name, email, password, address } = data

//     let { cpf_cnpj, zip_code } = data

//     cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
//     zip_code = zip_code.replace(/\D/g, '')

//     const passwordHash = await hash(password, 8)

//     const values = [name, email, passwordHash, cpf_cnpj, zip_code, address]

//     const results = await db.query(query, values)

//     return results.rows[0].id
//   } catch (error) {
//     console.error(error)
//   }

//   return this
// },

// async update(id, fields) {
//   let query = 'UPDATE users SET'

//   Object.keys(fields).forEach((key, index, array) => {
//     if (index + 1 < array.length) {
//       query = `${query}
//         ${key} = '${fields[key]}',
//       `
//     } else {
//       query = `${query}
//         ${key} = '${fields[key]}'
//         WHERE id = ${id}
//       `
//     }
//   })
//   await db.query(query)
// },

// async delete(id) {
//   // Get all products
//   const results = await Product.userProducts(id)
//   const products = results.rows

//   // Get all products imagens
//   const allFilesPromise = products.map((product) => {
//     return Product.files(product.id)
//   })

//   const promiseResults = await Promise.all(allFilesPromise)

//   const query = 'DELETE FROM users WHERE id = $1'

//   // Drop user from DB
//   await db.query(query, [id])

//   // Remove all imagens public folder
//   promiseResults.forEach((files) => {
//     return files.rows.forEach((file) => {
//       try {
//         if (file) unlinkSync(file.path)
//       } catch (error) {
//         console.error(error)
//       }
//     })
//   })
// },
