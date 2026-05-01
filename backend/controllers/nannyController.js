const { upsertProfile, findByNanny } = require('../models/NannyProfile')
const { setAvailability, getAvailability } = require('../models/Availability')

const saveProfile = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { bio, experience, skills, photo_url } = req.body
    const r = await upsertProfile({ nanny_id, bio, experience, skills, photo_url, verified: false })
    return res.json({ ok:true, data: r })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const getProfile = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const p = await findByNanny(nanny_id)
    return res.json({ ok:true, data: p })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const saveAvailability = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { availability } = req.body
    const r = await setAvailability({ nanny_id, availability })
    return res.json({ ok:true, data: r })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const getAvail = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const a = await getAvailability(nanny_id)
    return res.json({ ok:true, data: a })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

module.exports = { saveProfile, getProfile, saveAvailability, getAvail }
