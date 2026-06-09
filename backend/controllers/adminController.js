const pool = require('../config/db')
const { findAll, updateStatus: updateComplaint } = require('../models/Complaint')
const { findAllActive, updateStatus: updateAlert } = require('../models/EmergencyAlert')

// Fallback mock data if tables don't have the columns yet
let pendingVerificationsMock = [
  { id: 101, name: 'Kamrun Nahar', type: 'Nanny', docs: ['NID', 'Police Clearance', 'Selfie'], status: 'Pending' },
  { id: 102, name: 'Caring Hearts Agency', type: 'Organization', docs: ['Trade License', 'Owner NID'], status: 'Pending' },
  { id: 103, name: 'Deedhity Dhara', type: 'Nanny', docs: ['NID', 'Medical', 'Selfie'], status: 'Pending' }
];

const getMetrics = async (req, res) => {
  try {
    const [[{ totalParents }]] = await pool.query("SELECT COUNT(*) as totalParents FROM users WHERE role = 'parent'");
    const [[{ totalNannies }]] = await pool.query("SELECT COUNT(*) as totalNannies FROM users WHERE role = 'nanny'");
    const [[{ totalDaycares }]] = await pool.query("SELECT COUNT(*) as totalDaycares FROM users WHERE role = 'daycare'");
    
    // Complaints
    const [[{ pendingComplaints }]] = await pool.query("SELECT COUNT(*) as pendingComplaints FROM complaints WHERE status = 'Open'");
    
    // Emergencies
    const [[{ activeEmergencies }]] = await pool.query("SELECT COUNT(*) as activeEmergencies FROM emergency_alerts WHERE status = 'Active'");

    res.json({
      ok: true,
      data: {
        totalParents,
        totalNannies,
        totalDaycares,
        pendingComplaints,
        activeEmergencies,
        pendingVerifications: pendingVerificationsMock.filter(v => v.status === 'Pending').length,
        todayRevenue: 4500 // Mock revenue
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC");
    res.json({ ok: true, data: users });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const getComplaints = async (req, res) => {
  try {
    const complaints = await findAll();
    res.json({ ok: true, data: complaints });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const resolveComplaint = async (req, res) => {
  try {
    await updateComplaint(req.params.id, 'Resolved');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const getEmergencies = async (req, res) => {
  try {
    const emergencies = await findAllActive();
    res.json({ ok: true, data: emergencies });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const resolveEmergency = async (req, res) => {
  try {
    await updateAlert(req.params.id, 'Resolved');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

const getPendingVerifications = async (req, res) => {
  try {
    const data = pendingVerificationsMock.filter(v => v.status === 'Pending');
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const item = pendingVerificationsMock.find(v => v.id == id);
    if (item) {
      item.status = status;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

const getAdoptions = async (req, res) => {
  try {
    // Check if the table exists first, otherwise return mock/empty
    const [rows] = await pool.query(`
      SELECT a.*, p.name as parent_name, c.child_name, o.orphanage_name 
      FROM adoption_applications a
      LEFT JOIN users p ON a.parent_id = p.id
      LEFT JOIN adoption_children c ON a.child_id = c.id
      LEFT JOIN adoption_orphanages o ON a.orphanage_id = o.id
      ORDER BY a.created_at DESC
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    // If the table doesn't exist yet, return empty array gracefully
    console.error("Adoptions query error:", err.message);
    res.json({ ok: true, data: [] });
  }
};

const getMarketplace = async (req, res) => {
  try {
    const [shops] = await pool.query(`
      SELECT s.*, u.name, u.email 
      FROM seller_profiles s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.joined_date DESC
    `);
    
    const [products] = await pool.query(`
      SELECT id, name, price, status, remaining, sold 
      FROM products 
      ORDER BY created_at DESC LIMIT 50
    `);
    
    res.json({ ok: true, data: { shops, products } });
  } catch (err) {
    console.error("Marketplace query error:", err.message);
    res.json({ ok: true, data: { shops: [], products: [] } });
  }
};

const takeUserAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'notice', 'suspend', 'ban'
    
    let newStatus = 'active';
    if (action === 'suspend') newStatus = 'suspended';
    if (action === 'ban') newStatus = 'banned';
    
    // For notice, we might not change the status, just log it. But for suspend/ban, we change status.
    if (action === 'suspend' || action === 'ban') {
      await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    }
    
    res.json({ ok: true, message: `User action ${action} applied successfully.` });
  } catch (err) {
    console.error("Take user action error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports = { 
  getMetrics, 
  getUsers, 
  getComplaints, 
  resolveComplaint, 
  getEmergencies, 
  resolveEmergency,
  getPendingVerifications, 
  updateVerificationStatus,
  getAdoptions,
  getMarketplace,
  takeUserAction
};
