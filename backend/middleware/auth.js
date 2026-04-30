const jwt = require('jsonwebtoken')
const { findById } = require('../models/User')

const auth = async (req, res, next) => {
  try{
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).json({ ok:false, message:'Missing token' })
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await findById(payload.id)
    if(!user) return res.status(401).json({ ok:false, message:'Invalid token' })
    req.user = user
    next()
  }catch(err){
    return res.status(401).json({ ok:false, message:'Unauthorized', error: err.message })
  }
}

module.exports = auth
