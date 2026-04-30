const permit = (...allowed) => (req, res, next) => {
  const { user } = req
  if (!user) return res.status(401).json({ ok:false, message: 'Unauthorized' })
  if (!allowed.includes(user.role)) return res.status(403).json({ ok:false, message: 'Forbidden' })
  next()
}

module.exports = { permit }
