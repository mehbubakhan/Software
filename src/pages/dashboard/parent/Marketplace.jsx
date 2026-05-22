import React, { useState } from 'react'
import api from '../../../services/api'

export default function Marketplace() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)

  const categories = ['All', 'Baby Food', 'Toys', 'Clothes', 'Health', 'Educational']

  const products = [
    {
      id: 1,
      name: 'Organic Baby Formula',
      category: 'Baby Food',
      price: 24.99,
      rating: 4.8,
      reviews: 128,
      image: '🥛',
      inStock: true,
      description: 'Premium organic infant formula'
    },
    {
      id: 2,
      name: 'Soft Baby Rattle',
      category: 'Toys',
      price: 12.99,
      rating: 4.6,
      reviews: 95,
      image: '🎶',
      inStock: true,
      description: 'Developmental toy for infants'
    },
    {
      id: 3,
      name: 'Baby Cotton Onesie',
      category: 'Clothes',
      price: 18.99,
      rating: 4.7,
      reviews: 203,
      image: '👕',
      inStock: true,
      description: 'Comfortable cotton clothing'
    },
    {
      id: 4,
      name: 'First Aid Kit',
      category: 'Health',
      price: 34.99,
      rating: 4.9,
      reviews: 156,
      image: '🏥',
      inStock: true,
      description: 'Complete baby first aid kit'
    },
    {
      id: 5,
      name: 'Alphabet Learning Blocks',
      category: 'Educational',
      price: 29.99,
      rating: 4.8,
      reviews: 87,
      image: '🧩',
      inStock: true,
      description: 'Colorful educational building blocks'
    },
    {
      id: 6,
      name: 'Teething Ring',
      category: 'Health',
      price: 9.99,
      rating: 4.5,
      reviews: 142,
      image: '💍',
      inStock: true,
      description: 'Soothing silicone teething toy'
    }
  ]

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    alert(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    try {
      await api.post('/marketplace/order', {
        items: cart,
        total: total
      })
      alert('Order placed successfully!')
      setCart([])
      setShowCheckout(false)
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Baby Product Marketplace</h1>
          <p className="text-slate-600 mt-2">Quality products for your little ones</p>
        </div>
        <div className="relative">
          <button className="relative px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-fuchsia-500 transition">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat.toLowerCase())}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              activeCategory === cat.toLowerCase()
                ? 'bg-fuchsia-600 text-white'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-lg transition">
            <div className="text-5xl mb-3">{product.image}</div>
            <h3 className="font-bold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-600 mb-2">{product.description}</p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-fuchsia-600">${product.price}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">In Stock</span>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 bg-white border-t border-l border-slate-200 rounded-tl-lg p-4 m-4 max-w-sm shadow-lg">
          <h3 className="font-bold text-slate-900 mb-3">🛒 Shopping Cart</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-600">${item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-fuchsia-600">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Checkout</h2>

            <div className="space-y-2 mb-6 p-3 bg-slate-50 rounded">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between font-bold">
                <span>Total:</span>
                <span className="text-lg text-fuchsia-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <input type="text" placeholder="Delivery Address" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option>Select Payment Method</option>
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
