const { recordResponse } = require('../models/Safety')
const { createAlert } = require('../models/EmergencyAlert')
const { getIo } = require('../socket')
const pool = require('../config/db')

const respond = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { check_id, response, note } = req.body
    const r = await recordResponse({ nanny_id, check_id, response, note })
    return res.json({ ok:true, data: r })
  }catch(err){ 
    return res.json({ ok:true, mock: true }) 
  }
}

const triggerEmergencySos = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name || 'A user';
    const { childId, location, timestamp } = req.body;
    
    // Parse location if it's an object from the frontend
    let locationStr = 'Unknown Location';
    if (location && location.latitude && location.longitude) {
      locationStr = `${location.latitude}, ${location.longitude}`;
    } else if (typeof location === 'string') {
      locationStr = location;
    }

    const message = `Parent ${userName} triggered an Emergency SOS for their child.`;

    // 1. Create real DB emergency alert
    try {
      await createAlert({
        user_id: userId,
        type: 'SECURITY',
        location: locationStr,
        message: message
      });
    } catch(e) { console.error('Error creating emergency alert:', e) }

    // 2. Insert into admin_notifications
    try {
      await pool.query(
        "INSERT INTO admin_notifications (title, message) VALUES (?, ?)",
        ['🚨 URGENT: Parent SOS Activated!', message + ` at Location: ${locationStr}`]
      );
    } catch(e) { console.error('Error creating admin notification:', e) }

    // 3. Emit via WebSockets
    try {
      const io = getIo();
      const notifObj = {
        id: 'sos_parent_' + Date.now(),
        title: '🚨 URGENT: Parent SOS Activated!',
        message: message + ` at Location: ${locationStr}`,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      io.to('role_admin').emit('notification', notifObj);
      io.emit('admin_notification', notifObj);
      io.to('role_admin').emit('emergency_updated');
    } catch(e) { console.error('Socket emit error:', e) }

    return res.json({ ok: true, message: 'Emergency SOS activated' });
  } catch (err) {
    console.error('Error triggering SOS:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { respond, triggerEmergencySos }
