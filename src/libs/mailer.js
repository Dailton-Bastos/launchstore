const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '07fdbfc0abcbe9',
    pass: '268d968b66a264',
  },
})
