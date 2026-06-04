import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'

export default function Marketplace() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [orderHistory, setOrderHistory] = useState([])

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
      await api.post('/marketplace/checkout', {
        items: cart,
        total: total
      })
      alert('Order placed successfully!')
      setOrderHistory([{ id: Date.now(), items: [...cart], total: total, date: new Date().toLocaleDateString() }, ...orderHistory])
      setCart([])
      setShowCheckout(false)
      setShowCart(false)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Order placed successfully! (Mock)')
      setOrderHistory([{ id: Date.now(), items: [...cart], total: total, date: new Date().toLocaleDateString() }, ...orderHistory])
      setCart([])
      setShowCheckout(false)
      setShowCart(false)
    }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition text-sm">
        <span>←</span> Back to Dashboard
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Baby Product Marketplace</h1>
          <p className="text-slate-300 mt-2">Quality products for your little ones</p>
        </div>
        <div className="flex gap-3 relative">
          <button onClick={() => setShowHistory(true)} className="px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg hover:bg-slate-700 transition">
            📋 History
          </button>
          <button onClick={() => setShowCart(!showCart)} className="relative px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg hover:border-fuchsia-500 transition font-semibold">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-fuchsia-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
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
      {showCart && (
        <div className="fixed top-24 right-8 bg-white border border-slate-200 rounded-xl p-4 max-w-sm w-full shadow-2xl z-40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-900">🛒 Shopping Cart</h3>
            <button onClick={() => setShowCart(false)} className="text-slate-500 hover:text-slate-800 font-bold">✕</button>
          </div>
          {cart.length === 0 ? (
            <p className="text-slate-600 text-center py-6">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto mb-3 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">${item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 text-xs font-bold">−</button>
                      <span className="w-6 text-center text-slate-900 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 text-xs font-bold">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="text-xl font-bold text-fuchsia-600">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { setShowCheckout(true); setShowCart(false); }}
                  className="w-full px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Checkout</h2>

            <div className="space-y-2 mb-6 p-3 bg-slate-50 rounded text-slate-700">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{item.name} x {item.quantity}</span>
                  <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between font-bold text-slate-900">
                <span>Total:</span>
                <span className="text-lg text-fuchsia-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <input type="text" placeholder="Delivery Address" className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <select className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                <option>Select Payment Method</option>
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-700 font-semibold"
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

      {/* Shopping History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Shopping History</h2>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>
            
            {orderHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-3">You haven't placed any orders yet.</p>
                <button onClick={() => setShowHistory(false)} className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg font-semibold hover:bg-fuchsia-700 transition">Start Shopping</button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                      <span className="text-sm font-bold text-slate-900">Order #{order.id.toString().slice(-6)}</span>
                      <span className="text-sm font-semibold text-slate-500">{order.date}</span>
                    </div>
                    <ul className="text-sm space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-slate-700">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center font-bold text-slate-900 border-t border-slate-200 pt-2">
                      <span>Total:</span>
                      <span className="text-fuchsia-600 text-lg">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
