async function post(req, res, next) {
  const keys = Object.keys(req.body)
  const isValid = keys.every((key) => req.body[key] !== '')

  if (!isValid) {
    return res.send('Por favor, volte e preencha todos os campos.')
  }

  if (!req.files || req.files.length === 0) {
    return res.send('Por favor, envie pelo menos uma imagem.')
  }

  return next()
}

async function put(req, res, next) {
  const keys = Object.keys(req.body)

  keys.forEach((key) => {
    const isValid = req.body[key] === '' && key !== 'removed_files'
    if (isValid) return res.send('Por favor, volte e preencha todos os campos.')
    return isValid
  })
}

module.exports = {
  post,
  put,
}
