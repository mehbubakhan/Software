const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findByEmail } = require('../models/User')
const { createChild } = require('../models/Child')

const signup = async (req, res) => {
  try{
    console.log('Signup request:', req.body)
    const { password, role, dob } = req.body
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const childName = req.body.childName?.trim()
    if (!name || !email || !password || !role) {
      return res.status(400).json({ ok:false, message: 'Missing required fields' })
    }
    const existing = await findByEmail(email)
    if (existing) return res.status(400).json({ ok:false, message: 'Email already used' })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await createUser({ name, email, passwordHash: hash, role })
    if (role === 'parent' && childName) {
      await createChild({ name: childName, parent_id: user.id, dob: dob || null })
    }
    console.log('User created:', user.id)
    return res.json({ ok:true, user })
  }catch(err){ 
    console.error('Signup error:', err)
    return res.status(500).json({ ok:false, error: err.message }) 
  }
}

const login = async (req, res) => {
  try{
    console.log('Login request:', req.body)
    const email = req.body.email?.trim().toLowerCase()
    const { password } = req.body
    if (!email || !password) {
      return res.status(400).json({ ok:false, message: 'Email and password required' })
    }
    const user = await findByEmail(email)
    if (!user) return res.status(400).json({ ok:false, message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ ok:false, message: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
    console.log('Token generated for user:', user.id)
    return res.json({ ok:true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  }catch(err){ 
    console.error('Login error:', err)
    return res.status(500).json({ ok:false, error: err.message }) 
  }
}

module.exports = { signup, login }
