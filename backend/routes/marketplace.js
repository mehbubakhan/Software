const express = require('express')
const router = express.Router()

router.post('/order', (req, res) => {
  const { items, total } = req.body
  // Mock saving order to database
  res.json({ success: true, message: 'Order placed successfully', orderId: Math.floor(Math.random() * 10000) })
})

router.get('/products', (req, res) => {
  res.json([]) 
})

module.exports = router
