const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findByEmail } = require('../models/User')
const { createChild } = require('../models/Child')

const signup = async (req, res) => {
  try{
    const { name, email, password, role, childName, dob } = req.body
    const existing = await findByEmail(email)
    if (existing) return res.status(400).json({ ok:false, message: 'Email already used' })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await createUser({ name, email, passwordHash: hash, role })
    if (role === 'parent' && childName) {
      await createChild({ name: childName, parent_id: user.id, dob })
    }
    return res.json({ ok:true, user })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const login = async (req, res) => {
  try{
    const { email, password } = req.body
    const user = await findByEmail(email)
    if (!user) return res.status(400).json({ ok:false, message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ ok:false, message: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
    // role-based response can include extras later
    return res.json({ ok:true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { signup, login }
