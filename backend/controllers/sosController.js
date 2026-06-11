const { sendSos, findAll, resolveSos } = require('../models/Sos')
const { createAlert } = require('../models/EmergencyAlert')
const { notifyParentsOfNanny } = require('../utils/notifier')
const { getIo } = require('../socket')

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
    
    // Create real DB emergency alert so Admin Dashboard sees it
    try {
      await createAlert({
        user_id: nanny_id,
        type: 'SECURITY',
        location: (lat && lng) ? `${lat}, ${lng}` : 'Unknown Location',
        message: message || 'SOS Triggered'
      });
    } catch(e) { console.error('Error creating emergency alert:', e) }

    try {
      const io = getIo();
      io.to('role_admin').emit('notification', { 
         id: 'sos_' + r.id, 
         title: '🚨 URGENT: SOS Activated!',
         message: `${req.user.name} (Nanny ID #${nanny_id}) triggered SOS: ${message || 'Emergency'}${lat&&lng?` at Location: ${lat},${lng}`:''}`, 
         created_at: new Date().toISOString(),
         is_read: false
      });
      // Also emit an event for the Live SOS list to refresh instantly
      io.to('role_admin').emit('emergency_updated');
    } catch(e) { console.error('socket error', e) }

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
