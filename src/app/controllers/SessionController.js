module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },

  login(req, res) {
    const { id } = req.user
    req.session.userId = id

    return res.redirect('/users')
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },
}
