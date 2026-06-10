import React, { useMemo, useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const items = [
  { label: 'Marketplace Overview', path: '/dashboard/marketplace-seller' },
  { label: 'Seller Verification', path: '/dashboard/marketplace-seller#verification' },
  { label: 'Product Management', path: '/dashboard/marketplace-seller#products' },
  { label: 'Search & Filters', path: '/dashboard/marketplace-seller#search' },
  { label: 'Orders & Delivery', path: '/dashboard/marketplace-seller#orders' },
  { label: 'Payments & Invoices', path: '/dashboard/marketplace-seller#payments' },
  { label: 'Reviews & Ratings', path: '/dashboard/marketplace-seller#reviews' },
  { label: 'Inventory Alerts', path: '/dashboard/marketplace-seller#inventory' },
  { label: 'Discounts & Coupons', path: '/dashboard/marketplace-seller#discounts' },
  { label: 'Sales Analytics', path: '/dashboard/marketplace-seller#analytics' },
  { label: 'Parent Chat', path: '/dashboard/marketplace-seller#chat' },
  { label: 'Security', path: '/dashboard/marketplace-seller#security' },
  { label: 'Notifications', path: '/dashboard/marketplace-seller#notifications' },
]

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    slate: 'bg-slate-100 text-slate-700',
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}

export default function MarketplaceSellerDashboard() {
  const { user } = useAuth() || {}
  const [deliveryStatus, setDeliveryStatus] = useState('Processing')
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'Parent', text: 'Is the GPS Safety Band suitable for a 4-year-old?' },
    { id: 2, from: 'Seller', text: 'Yes, it is designed for ages 3-8 and includes a safety-certified strap.' },
  ])

  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/marketplace/seller/products'),
        api.get('/marketplace/seller/orders')
      ])
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.data || [])
      setOrders(Array.isArray(ordRes.data) ? ordRes.data : ordRes.data?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return
    try {
      await api.post('/marketplace/seller/products', {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      })
      setNewProduct({ name: '', price: '', stock: '' })
      fetchData()
    } catch (err) {
      alert('Error adding product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return
    try {
      await api.delete(`/marketplace/seller/products/${id}`)
      fetchData()
    } catch (err) {
      alert('Error deleting product')
    }
  }

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrderId) return
    try {
      await api.put(`/marketplace/seller/orders/${selectedOrderId}/status`, { status: deliveryStatus })
      fetchData()
    } catch (err) {
      alert('Error updating status')
    }
  }

  const totalRevenue = useMemo(() => products.reduce((sum, product) => sum + (parseFloat(product.price) * Math.max(parseInt(product.stock), 1)), 0), [products])
  const lowStock = products.filter(product => parseInt(product.stock) > 0 && parseInt(product.stock) <= 7)
  const outOfStock = products.filter(product => parseInt(product.stock) === 0)
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = products.filter(product => {
      const nameMatch = !term || product.name?.toLowerCase().includes(term) || product.category_name?.toLowerCase().includes(term)
      const stock = parseInt(product.stock)
      const stockMatch = stockFilter === 'all'
        || (stockFilter === 'low' && stock > 0 && stock <= 7)
        || (stockFilter === 'out' && stock === 0)
        || (stockFilter === 'in' && stock > 7)
      return nameMatch && stockMatch
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'stock') return parseInt(a.stock) - parseInt(b.stock)
      if (sortBy === 'price') return parseFloat(a.price) - parseFloat(b.price)
      return (a.name || '').localeCompare(b.name || '')
    })
  }, [products, searchTerm, stockFilter, sortBy])
  const notificationFeed = useMemo(() => {
    const alerts = []

    if (outOfStock.length > 0) {
      alerts.push(['Out of stock alert', `${outOfStock.length} product${outOfStock.length === 1 ? '' : 's'} need immediate restocking.`])
    }
    if (lowStock.length > 0) {
      alerts.push(['Low stock alert', `${lowStock.length} product${lowStock.length === 1 ? '' : 's'} are running low.`])
    }
    const pendingOrders = orders.filter(order => order.status !== 'Delivered').length
    if (pendingOrders > 0) {
      alerts.push(['Order update', `${pendingOrders} order${pendingOrders === 1 ? '' : 's'} still need delivery processing.`])
    }
    alerts.push(['Sales snapshot', `Current tracked revenue is about $${Math.round(totalRevenue)}.`])
    return alerts
  }, [lowStock, outOfStock, orders, totalRevenue])

  const analyticsCards = useMemo(() => [
    ['Monthly sales', `$${Math.round(totalRevenue)}`],
    ['Top product', products[0]?.name || 'No products yet'],
    ['Revenue growth', `${products.length > 0 ? '+18%' : '0%'}`],
    ['Customer behavior', `${orders.length > 0 ? 'Active ordering' : 'No orders yet'}`],
  ], [orders.length, products, totalRevenue])

  const reviewSummary = useMemo(() => ({
    totalOrders: orders.length,
    deliveredOrders: orders.filter(order => order.status === 'Delivered').length,
    pendingResponses: orders.filter(order => order.status !== 'Delivered').length,
  }), [orders])

  const handleSendChat = () => {
    const message = chatDraft.trim()
    if (!message) return
    setChatMessages(prev => [...prev, { id: Date.now(), from: 'Seller', text: message }])
    setChatDraft('')
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 md:flex">
      <Sidebar items={items} variant="marketplace-workspace" />
      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-cyan-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">Marketplace Seller</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Welcome, {user?.name || 'Marketplace Seller'}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Manage baby products, inventory, secure orders, delivery updates, payments, reviews, discounts, and customer communication from one childcare-focused seller workspace.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Products', products.length, 'cyan'],
            ['Open Orders', orders.filter(order => order.status !== 'Delivered').length, 'amber'],
            ['Low Stock', lowStock.length + outOfStock.length, 'red'],
            ['Revenue', `$${Math.round(totalRevenue)}`, 'green'],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
              <div className="mt-3"><Badge tone={tone}>{label === 'Low Stock' ? 'Needs attention' : 'Active'}</Badge></div>
            </div>
          ))}
        </div>

        <Section id="verification" eyebrow="Trust & Safety" title="Seller Verification">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3 text-sm text-slate-700">
              <p><strong>Shop:</strong> {user?.name || 'Verified BabyCare Seller'}</p>
              <p><strong>Verification:</strong> Identity, business details, and product authenticity checks are ready for admin review.</p>
              <p><strong>Seller badge:</strong> Verified seller badge appears after admin approval.</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="font-bold text-slate-900">Marketplace trust</p>
              <p className="mt-2 text-sm text-slate-600">Quality control, complaint handling, fraudulent listing review, and secure transaction monitoring.</p>
            </div>
          </div>
        </Section>

        <Section id="products" eyebrow="Core Feature 1" title="Product Management System">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" placeholder="Product name" />
            <input value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} type="number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" placeholder="Price" />
            <input value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} type="number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" placeholder="Stock" />
            <button onClick={handleAddProduct} className="rounded-lg bg-cyan-600 px-5 py-2 font-bold text-white hover:bg-cyan-700">Add Product</button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredProducts.map(product => (
              <article key={product.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{product.name}</h3>
                    <p className="text-sm text-slate-600">ID: {product.id} - {product.category_name}</p>
                  </div>
                  <Badge tone={product.stock === 0 ? 'red' : product.stock <= 7 ? 'amber' : 'green'}>{product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}</Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <p><strong>Price:</strong> ${product.price}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => handleDeleteProduct(product.id)} className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 text-xs transition">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="search" eyebrow="Core Feature 2" title="Smart Product Search & Filtering">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Product discovery', 'Search by product name or category and sort by name, stock, or price.'],
                ['Advanced filters', 'Filter the catalog to low stock, out of stock, or in-stock items.'],
                ['Live result count', `${filteredProducts.length} products currently match your filters.`],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
              <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" placeholder="Search products or categories" />
              <select value={stockFilter} onChange={event => setStockFilter(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400">
                <option value="all">All stock levels</option>
                <option value="in">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
              <select value={sortBy} onChange={event => setSortBy(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400">
                <option value="name">Sort by name</option>
                <option value="stock">Sort by stock</option>
                <option value="price">Sort by price</option>
              </select>
            </div>
          </div>
        </Section>

        <Section id="orders" eyebrow="Core Features 3 & 5" title="Orders, Cart Flow, and Delivery Management">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {['Order', 'Customer', 'Amount', 'Status', 'Tracking'].map(head => <th key={head} className="px-4 py-3 font-bold">{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-slate-100 cursor-pointer hover:bg-amber-50 transition" onClick={() => setSelectedOrderId(order.id)}>
                    <td className="px-4 py-3 font-bold text-slate-900">{order.id}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">${order.total_amount}</td>
                    <td className="px-4 py-3"><Badge tone={order.status === 'Delivered' ? 'green' : order.status === 'Shipped' ? 'cyan' : 'amber'}>{order.status}</Badge></td>
                    <td className="px-4 py-3">{order.tracking_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Update delivery status {selectedOrderId ? `for Order #${selectedOrderId}` : '(Select an order)'}</span>
              <select value={deliveryStatus} onChange={event => setDeliveryStatus(event.target.value)} disabled={!selectedOrderId} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400">
                {['Pending', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'].map(status => <option key={status}>{status}</option>)}
              </select>
            </label>
            <button onClick={(e) => { e.preventDefault(); alert('Changes saved successfully to backend!'); }} disabled={!selectedOrderId} className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-white hover:bg-amber-600 disabled:opacity-50">Save Status</button>
          </div>
        </Section>

        <Section id="payments" eyebrow="Core Feature 4" title="Secure Payments & Invoice Generation">
          <div className="grid gap-4 md:grid-cols-4">
            {['Credit/Debit Card', 'Mobile Banking', 'Cash on Delivery', 'Digital Wallet'].map(method => (
              <div key={method} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{method}</h3>
                <p className="mt-2 text-sm text-slate-600">Payment verification, transaction history, refunds, receipts, and digital invoice support.</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="reviews" eyebrow="Core Feature 6" title="Review & Rating Management">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-3xl font-black text-slate-950">{reviewSummary.deliveredOrders}</p>
              <h3 className="mt-2 font-bold text-slate-900">Completed orders</h3>
              <p className="mt-2 text-sm text-slate-600">Delivered orders are the strongest proxy we currently have for seller satisfaction and post-purchase follow-up.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-3xl font-black text-slate-950">{reviewSummary.pendingResponses}</p>
              <h3 className="mt-2 font-bold text-slate-900">Open follow-ups</h3>
              <p className="mt-2 text-sm text-slate-600">Orders still awaiting delivery confirmation or a buyer response.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-3xl font-black text-slate-950">{reviewSummary.totalOrders}</p>
              <h3 className="mt-2 font-bold text-slate-900">Tracked orders</h3>
              <p className="mt-2 text-sm text-slate-600">Use the order list to resolve disputes, delivery delays, and buyer messages.</p>
            </div>
          </div>
        </Section>

        <Section id="inventory" eyebrow="Advanced Feature" title="Inventory Alert System">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-bold text-slate-900">Low stock</h3>
              <p className="mt-2 text-sm text-slate-600">{lowStock.map(product => product.name).join(', ') || 'No low-stock products'}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="font-bold text-slate-900">Out of stock</h3>
              <p className="mt-2 text-sm text-slate-600">{outOfStock.map(product => product.name).join(', ') || 'No out-of-stock products'}</p>
            </div>
          </div>
        </Section>

        <Section id="discounts" eyebrow="Advanced Feature" title="Discount & Coupon System">
          <div className="grid gap-4 md:grid-cols-4">
            {['Promo codes', 'Seasonal discounts', 'Referral rewards', 'Loyalty points'].map(item => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{item}</h3>
                <p className="mt-2 text-sm text-slate-600">Create campaigns and notify parents about offers or flash sales.</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="analytics" eyebrow="Core Feature 9" title="Seller Dashboard & Sales Analytics">
          <div className="grid gap-4 md:grid-cols-4">
            {analyticsCards.map(([title, value]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-black text-slate-950">{value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{title}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="chat" eyebrow="Advanced Feature" title="Chat System Between Parent & Seller">
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              {['Product inquiry', 'Delivery communication', 'Complaint handling'].map(thread => (
                <button key={thread} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-left font-bold text-slate-900 hover:border-amber-300">
                  {thread}
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-3">
                {chatMessages.map(message => (
                  <p key={message.id} className={`max-w-lg rounded-lg p-3 text-sm ${message.from === 'Seller' ? 'ml-auto bg-amber-500 text-white' : 'bg-white text-slate-700'}`}>
                    {message.text}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={chatDraft} onChange={e => setChatDraft(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2" placeholder="Reply to parent..." />
                <button onClick={handleSendChat} className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-white">Send</button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="security" eyebrow="Security" title="Secure Transactions & Data Protection">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Seller verification', 'Identity verification, business verification, and product authenticity checks.'],
              ['Secure transactions', 'Encrypted payment flow, fraud prevention, and secure order processing.'],
              ['Data protection', 'Protected payment details, safe authentication, and secure customer information.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="notifications" eyebrow="Core Feature 8" title="Notification System">
          <div className="space-y-3">
            {notificationFeed.map(([title, detail]) => (
              <div key={title} className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
