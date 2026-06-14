const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/parent', auth, async (req, res) => {
  try {
    const parent_id = req.user.id;
    // Fetch notifications specific to this parent, OR global notifications (parent_id IS NULL)
    const [notifications] = await pool.query(
      "SELECT * FROM parent_notifications WHERE parent_id = ? OR parent_id IS NULL ORDER BY created_at DESC LIMIT 50",
      [parent_id]
    );

    res.json({ ok: true, data: notifications });
  } catch (err) {
    console.error("Error fetching parent notifications, using fallback:", err.message);
    if (!global.mockParentNotifications) {
      global.mockParentNotifications = [
        { id: 'm1', sender_role: 'system', title: 'Welcome', message: 'Welcome to the Smart Nanny platform!', created_at: new Date().toISOString() }
      ];
    }
    const filtered = global.mockParentNotifications.filter(n => !n.parent_id || n.parent_id === req.user.id);
    res.json({ ok: true, data: filtered.reverse().slice(0, 50) });
  }
});

router.put('/parent/:id/read', auth, async (req, res) => {
  try {
    await pool.query("UPDATE parent_notifications SET is_read = TRUE WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
