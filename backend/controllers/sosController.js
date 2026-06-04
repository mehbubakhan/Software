const { sendSos, findAll, resolveSos } = require('../models/Sos')
const { notifyParentsOfNanny } = require('../utils/notifier')

const sos = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { lat, lng, message } = req.body
    const r = await sendSos({ nanny_id, lat, lng, message })
    // notify parents (non-blocking)
    setImmediate(()=>{
      try{
        notifyParentsOfNanny(nanny_id, { subject: 'SOS Alert from your nanny', text: `${message || 'SOS triggered'}${lat&&lng?` Location: ${lat},${lng}`:''}` })
      }catch(e){ console.error('notifier error', e) }
    })
    return res.json({ ok:true, data: r })
  }catch(err){ return res.status(500).json({ ok:false, error: err.message }) }
}

const getAllSos = async (req, res) => {
  try {
    const data = await findAll();
    res.json({ ok: true, data });
  } catch(err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const updateSos = async (req, res) => {
  try {
    await resolveSos(req.params.id, req.body.status);
    res.json({ ok: true });
  } catch(err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { sos, getAllSos, updateSos }
