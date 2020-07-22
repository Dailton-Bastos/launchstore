function onlyUsers(req, res, next) {
  const { userId } = req.session

  if (!userId) return res.redirect('/users/login')

  return next()
}

function isLoggedRedirectToUsers(req, res, next) {
  const { userId } = req.session

  if (userId) return res.redirect('/users')

  return next()
}

module.exports = { onlyUsers, isLoggedRedirectToUsers }
