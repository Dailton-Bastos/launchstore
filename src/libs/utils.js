module.exports = {
  formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100)
  },

  date(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return {
      day,
      month,
      year,
      hours,
      minutes,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
    }
  },

  formatCpfCnpj(value) {
    value = value.replace(/\D/g, '')

    if (value.length > 14) value = value.slice(0, -1)

    // chef is cnpj
    if (value.length > 11) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      // CFF
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1-$2')
    }

    return value
  },

  formatZipCode(value) {
    let zip_code = String(value)
    zip_code = zip_code.replace(/\D/g, '')

    if (zip_code.length > 8) zip_code = zip_code.slice(0, -1)

    zip_code = zip_code.replace(/(\d{5})(\d)/, '$1-$2')

    return zip_code
  },
}
