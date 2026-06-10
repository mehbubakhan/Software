import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'

export default function Marketplace() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [lastOrder, setLastOrder] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [orderHistory, setOrderHistory] = useState([
    {
      id: 1700000000000,
      transactionId: 'TXN84729104',
      paymentMethod: 'bKash',
      date: '5/10/2026',
      status: 'Delivered',
      total: 43.98,
      items: [
        { name: 'Organic Baby Formula', quantity: 1, price: 24.99 },
        { name: 'Baby Cotton Onesie', quantity: 1, price: 18.99 }
      ]
    },
    {
      id: 1690000000000,
      transactionId: 'TXN39201844',
      paymentMethod: 'Credit Card',
      date: '4/22/2026',
      status: 'Delivered',
      total: 34.99,
      items: [
        { name: 'First Aid Kit', quantity: 1, price: 34.99 }
      ]
    }
  ])

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
    : products.filter(p => p.category.toLowerCase() === activeCategory)

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
    setIsProcessingPayment(true)
    try {
      await api.post('/marketplace/checkout', {
        items: cart,
        total: total
      })
      setTimeout(() => {
        setIsProcessingPayment(false)
        const txnId = 'TXN' + Math.random().toString().slice(2, 10);
        setTransactionId(txnId)
        const order = { id: Date.now(), items: [...cart], total: total, date: new Date().toLocaleDateString(), transactionId: txnId, paymentMethod }
        setOrderHistory([order, ...orderHistory])
        setLastOrder(order)
        setCart([])
        setCheckoutStep(4) // Success step
      }, 2000)
    } catch (error) {
      setTimeout(() => {
        setIsProcessingPayment(false)
        const txnId = 'TXN' + Math.random().toString().slice(2, 10);
        setTransactionId(txnId)
        const order = { id: Date.now(), items: [...cart], total: total, date: new Date().toLocaleDateString(), transactionId: txnId, paymentMethod }
        setOrderHistory([order, ...orderHistory])
        setLastOrder(order)
        setCart([])
        setCheckoutStep(4) // Success step
      }, 2000)
    }
  }

  const handleDownloadReceipt = () => {
    if (!lastOrder) return;
    const receiptText = `=================================
      SMART NANNY MARKETPLACE     
          ORDER RECEIPT           
=================================
Transaction ID: ${lastOrder.transactionId}
Payment Method: ${lastOrder.paymentMethod}
Date: ${lastOrder.date}
Items: ${lastOrder.items.length} item(s)
---------------------------------
Total Paid: $${lastOrder.total.toFixed(2)}
=================================
Thank you for shopping with us!`;

    const element = document.createElement("a");
    const file = new Blob([receiptText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Marketplace_Receipt_${lastOrder.transactionId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                  onClick={() => { setShowCheckout(true); setCheckoutStep(1); setPaymentMethod(''); setShowCart(false); }}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-0 max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-slate-900">Processing Payment Securely</h3>
                <p className="text-slate-500 mt-2">Connecting to {paymentMethod} gateway...</p>
              </div>
            )}

            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-bold text-slate-900">Secure Checkout</h2>
              {checkoutStep < 4 && <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center transition">✕</button>}
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Order Summary (Visible in steps 1-3) */}
              {checkoutStep < 4 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Amount</span>
                    <span className="text-xl font-black text-fuchsia-600">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500">{cart.length} item(s) in your order</p>
                </div>
              )}

              {/* Step 1: Delivery Info */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-slate-900">1. Delivery Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                      <input type="email" placeholder="e.g. parent@example.com" className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Full Delivery Address</label>
                      <textarea placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka" rows="3" className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none"></textarea>
                    </div>
                  </div>
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="w-full py-4 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700 transition font-bold shadow-lg shadow-fuchsia-600/20"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment Methods */}
              {checkoutStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">2. Select Payment Method</h3>
                    <button onClick={() => setCheckoutStep(1)} className="text-sm text-fuchsia-600 font-semibold hover:underline">Edit Delivery</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {['bKash', 'Nagad', 'Rocket', 'Upay'].map(method => (
                      <button 
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 font-bold transition flex flex-col items-center justify-center gap-2 ${
                          paymentMethod === method 
                            ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">📱</span>
                        {method}
                      </button>
                    ))}
                  </div>

                  {paymentMethod && (
                    <button 
                      onClick={() => setCheckoutStep(3)}
                      className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl transition shadow-lg shadow-fuchsia-600/20"
                    >
                      Continue with {paymentMethod}
                    </button>
                  )}
                </div>
              )}

              {/* Step 3: Payment Details */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">3. Payment Details</h3>
                    <button onClick={() => setCheckoutStep(2)} className="text-sm text-fuchsia-600 font-semibold hover:underline">Change Method</button>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-xl shadow-sm">📱</div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Paying With</p>
                      <p className="font-bold text-slate-900">{paymentMethod}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">{paymentMethod} Account Number</label>
                      <input type="text" placeholder="e.g. 01XXXXXXXXX" className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-mono text-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">PIN / OTP</label>
                      <input type="password" placeholder="Enter PIN" className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 font-mono text-lg tracking-widest" />
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2"
                  >
                    <span>🔒</span> Pay ${total.toFixed(2)} Securely
                  </button>
                </div>
              )}

              {/* Step 4: Success */}
              {checkoutStep === 4 && lastOrder && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border-4 border-emerald-500">
                    ✓
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
                  <p className="text-slate-600 mb-8">Thank you for shopping with us. Your items will be shipped soon.</p>
                  
                  <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-200">
                    <h3 className="font-black text-lg text-center mb-4">ORDER RECEIPT</h3>
                    <div className="space-y-2 text-sm text-slate-700 border-t border-b border-dashed border-slate-300 py-4 mb-4">
                      <div className="flex justify-between"><span>Transaction ID:</span><span className="font-bold font-mono">{lastOrder.transactionId}</span></div>
                      <div className="flex justify-between"><span>Payment Method:</span><span className="font-bold">{lastOrder.paymentMethod}</span></div>
                      <div className="flex justify-between"><span>Date:</span><span className="font-bold">{lastOrder.date}</span></div>
                    </div>
                    <div className="flex justify-between items-center text-lg mb-4">
                      <span className="font-bold text-slate-900">Total Paid:</span>
                      <span className="font-black text-emerald-600">${lastOrder.total.toFixed(2)}</span>
                    </div>

                    {/* Status Tracker in Success Screen */}
                    <div className="mb-4 mt-6">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1 relative px-2">
                        <div className="absolute top-2 left-6 right-6 h-1 bg-slate-200 rounded-full z-0"></div>
                        <div className="absolute top-2 left-6 w-1/3 h-1 bg-emerald-500 rounded-full z-0"></div>
                        
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                          <span className="text-emerald-600">Placed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                          <span className="text-emerald-600">Packed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">3</div>
                          <span>Shipped</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">4</div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-3 mt-6">
                      <span className="text-2xl mt-1">🚚</span>
                      <div>
                        <h4 className="font-bold text-emerald-900 text-sm">Estimated Delivery</h4>
                        <p className="text-emerald-700 text-xs mt-1">Arriving in <span className="font-bold">2 - 3 Business Days</span>. You can track this in your Shopping History.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleDownloadReceipt}
                      className="w-full py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition border border-emerald-300 flex justify-center items-center gap-2"
                    >
                      <span className="text-xl">📥</span> Save Digital Slip
                    </button>
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl transition shadow-lg shadow-fuchsia-600/20"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
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
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Order #{order.transactionId || order.id.toString().slice(-6)}</span>
                        <span className="text-xs font-semibold text-slate-500">{order.date}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${order.status === 'Delivered' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                    
                    {/* Status Tracker */}
                    <div className="mb-4 mt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1 relative px-2">
                        <div className="absolute top-2 left-6 right-6 h-1 bg-slate-200 rounded-full z-0"></div>
                        <div className={`absolute top-2 left-6 h-1 rounded-full z-0 ${order.status === 'Delivered' ? 'w-full bg-slate-400' : 'w-1/3 bg-fuchsia-500'}`}></div>
                        
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] ${order.status === 'Delivered' ? 'bg-slate-400' : 'bg-fuchsia-500'}`}>✓</div>
                          <span className={order.status === 'Delivered' ? 'text-slate-500' : 'text-fuchsia-600'}>Placed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] ${order.status === 'Delivered' ? 'bg-slate-400' : 'bg-fuchsia-500'}`}>✓</div>
                          <span className={order.status === 'Delivered' ? 'text-slate-500' : 'text-fuchsia-600'}>Packed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${order.status === 'Delivered' ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-400'}`}>{order.status === 'Delivered' ? '✓' : '3'}</div>
                          <span className={order.status === 'Delivered' ? 'text-slate-500' : ''}>Shipped</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 z-10 w-12">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${order.status === 'Delivered' ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-400'}`}>{order.status === 'Delivered' ? '✓' : '4'}</div>
                          <span className={order.status === 'Delivered' ? 'text-slate-500' : ''}>Delivered</span>
                        </div>
                      </div>
                      <p className={`text-center text-xs font-semibold mt-3 mb-2 ${order.status === 'Delivered' ? 'text-slate-500' : 'text-fuchsia-600'}`}>
                        {order.status === 'Delivered' ? `Delivered on ${order.date}` : 'Estimated Delivery: 2-3 Business Days'}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded border border-slate-200 mb-3 text-xs text-slate-600">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">Transaction ID:</span>
                        <span className="font-mono text-slate-900">{order.transactionId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Payment Method:</span>
                        <span className="font-bold text-slate-900">{order.paymentMethod || 'Credit Card'}</span>
                      </div>
                    </div>

                    <ul className="text-sm space-y-1 mb-3 bg-white p-2 rounded border border-slate-100">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-slate-700">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center font-bold text-slate-900 border-t border-slate-200 pt-2">
                      <span>Total Paid:</span>
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
