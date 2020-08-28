const { formatPrice } = require('./utils')

const Cart = {
  init(oldCart) {
    if (oldCart) {
      this.items = oldCart.items
      this.total = oldCart.total
    } else {
      this.items = []
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0),
      }
    }

    return this
  },

  addOne(product) {
    // check if product already exists in Cart
    let inCart = this.getCardItem(product.id)

    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price),
        },
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0),
      }

      this.items.push(inCart)
    }

    if (inCart.quantity >= product.quantity) return this

    // update item
    inCart.quantity += 1
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    // update cart
    this.total.quantity += 1
    this.total.price += inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    return this
  },

  removeOne(productId) {
    const inCart = this.getCardItem(productId)

    if (!inCart) return this

    inCart.quantity -= 1
    inCart.price = inCart.product.price * inCart.quantity
    inCart.formattedPrice = formatPrice(inCart.price)

    this.total.quantity -= 1
    this.total.price = inCart.product.price
    this.total.formattedPrice = formatPrice(this.total.price)

    if (inCart.quantity < 1) {
      this.items = this.items.filter((item) => {
        return item.product.id !== inCart.product.id
      })
    }

    return this
  },

  delete(productId) {
    const inCart = this.getCardItem(productId)

    if (!inCart) return this

    if (this.items.length > 0) {
      this.total.quantity -= inCart.quantity
      this.total.price -= inCart.product.price * inCart.quantity
      this.total.formattedPrice = formatPrice(this.total.price)
    }

    this.items = this.items.filter((item) => {
      return inCart.product.id !== item.product.id
    })

    return this
  },

  getCardItem(productId) {
    return this.items.find((item) => item.product.id === productId)
  },
}

module.exports = Cart
