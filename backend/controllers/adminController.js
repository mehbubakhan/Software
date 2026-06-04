const pool = require('../config/db')

// ═══════════════════════════════════════════════════
// ADMIN CONTROLLER — DB-backed verifications & stats
// ═══════════════════════════════════════════════════

const getPendingVerifications = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT vd.id, u.id as user_id, u.name, u.role as type, 
             GROUP_CONCAT(vd.doc_type) as docs,
             MIN(vd.uploaded_at) as submitted_at
      FROM verification_documents vd
      JOIN users u ON vd.user_id = u.id
      WHERE vd.status = 'pending'
      GROUP BY u.id
      ORDER BY submitted_at DESC
    `);

    const data = rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name,
      type: r.type === 'nanny' ? 'Nanny' : 'Organization',
      docs: r.docs ? r.docs.split(',').map(d => {
        const labels = { NID: 'NID', selfie: 'Selfie', police_clearance: 'Police Clearance', medical: 'Medical', certificate: 'Certificate', trade_license: 'Trade License' };
        return labels[d] || d;
      }) : [],
      status: 'Pending',
      submitted_at: r.submitted_at
    }));

    res.json({ ok: true, data });
  } catch (err) {
    console.warn('[Admin] DB error for verifications:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [docs] = await pool.query('SELECT user_id FROM verification_documents WHERE id = ?', [id]);
    if (docs.length > 0) {
      const userId = docs[0].user_id;
      await pool.query('UPDATE verification_documents SET status = ? WHERE user_id = ?', [status === 'Approved' ? 'approved' : 'rejected', userId]);
      
      if (status === 'Approved') {
        await pool.query("UPDATE nanny_profiles SET verification_status = 'approved' WHERE user_id = ?", [userId]);
      }
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.warn('[Admin] DB error for verification update:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
};

const getSystemStats = async (req, res) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as c FROM users');
    const [totalNannies] = await pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'nanny'");
    const [totalParents] = await pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'parent'");
    const [totalDaycares] = await pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'daycare'");
    const [totalSellers] = await pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'marketplace_seller'");
    const [pendingVerifs] = await pool.query("SELECT COUNT(*) as c FROM verification_documents WHERE status = 'pending'");
    const [activeAlerts] = await pool.query("SELECT COUNT(*) as c FROM emergency_alerts WHERE status = 'active'");
    const [totalOrphanages] = await pool.query('SELECT COUNT(*) as c FROM adoption_orphanages');
    const [totalProducts] = await pool.query('SELECT COUNT(*) as c FROM products');
    const [totalOrders] = await pool.query('SELECT COUNT(*) as c FROM orders');
    const [activeSessions] = await pool.query("SELECT COUNT(*) as c FROM work_sessions WHERE status = 'active'");

    const [recentUsers] = await pool.query('SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT 5');

    res.json({
      ok: true,
      data: {
        totalUsers: totalUsers[0].c,
        totalNannies: totalNannies[0].c,
        totalParents: totalParents[0].c,
        totalDaycares: totalDaycares[0].c,
        totalSellers: totalSellers[0].c,
        pendingVerifications: pendingVerifs[0].c,
        activeAlerts: activeAlerts[0].c,
        totalOrphanages: totalOrphanages[0].c,
        totalProducts: totalProducts[0].c,
        totalOrders: totalOrders[0].c,
        activeSessions: activeSessions[0].c,
        recentUsers
      }
    });
  } catch (err) {
    console.warn('[Admin] DB error for stats:', err.message);
    res.json({
      ok: true,
      data: {
        totalUsers: 15, totalNannies: 5, totalParents: 2, totalDaycares: 2, totalSellers: 3,
        pendingVerifications: 3, activeAlerts: 2, totalOrphanages: 2, totalProducts: 10,
        totalOrders: 6, activeSessions: 1, recentUsers: []
      },
      mock: true
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    res.json({ ok: true, data: users });
  } catch (err) {
    res.json({ ok: true, data: [], mock: true });
  }
};

module.exports = { getPendingVerifications, updateVerificationStatus, getSystemStats, getAllUsers };
