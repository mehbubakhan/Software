const db = require('../config/db')

class DaycareModel {
  static async getDaycareByOwnerId(ownerId) {
    const [rows] = await db.query('SELECT * FROM daycares WHERE owner_id = ?', [ownerId])
    return rows[0]
  }

  static async createDaycare(ownerId, data) {
    const { name, license, address, phone, email, working_hours, capacity, description, facilities } = data
    const [result] = await db.query(
      'INSERT INTO daycares (owner_id, name, license, address, phone, email, working_hours, capacity, description, facilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ownerId, name, license, address, phone, email, working_hours, capacity, description, JSON.stringify(facilities || [])]
    )
    return result.insertId
  }

  static async updateDaycare(id, data) {
    const { name, license, address, phone, email, working_hours, capacity, description, facilities } = data
    await db.query(
      'UPDATE daycares SET name=?, license=?, address=?, phone=?, email=?, working_hours=?, capacity=?, description=?, facilities=? WHERE id=?',
      [name, license, address, phone, email, working_hours, capacity, description, JSON.stringify(facilities || []), id]
    )
    return id
  }

  static async getDashboardStats(daycareId) {
    const [[{ activeChildren }]] = await db.query("SELECT COUNT(*) as activeChildren FROM daycare_children WHERE daycare_id = ? AND status = 'active'", [daycareId])
    const [[{ pendingApprovals }]] = await db.query("SELECT COUNT(*) as pendingApprovals FROM daycare_applications WHERE daycare_id = ? AND status = 'pending'", [daycareId])
    const [[{ staffCount }]] = await db.query("SELECT COUNT(*) as staffCount FROM daycare_staff WHERE daycare_id = ?", [daycareId])
    
    // Mock today's bookings and revenue for MVP
    return {
      activeChildren: activeChildren || 0,
      pendingApprovals: pendingApprovals || 0,
      staffCount: staffCount || 0,
      todaysBookings: 24,
      revenueMonth: 12400
    }
  }

  static async getPackages(daycareId) {
    const [rows] = await db.query('SELECT * FROM daycare_packages WHERE daycare_id = ?', [daycareId])
    return rows
  }

  static async createPackage(daycareId, data) {
    const { type, price, age_group, duration, features } = data
    const [result] = await db.query(
      'INSERT INTO daycare_packages (daycare_id, type, price, age_group, duration, features) VALUES (?, ?, ?, ?, ?, ?)',
      [daycareId, type, price, age_group, duration, JSON.stringify(features || [])]
    )
    return result.insertId
  }

  static async getApplications(daycareId) {
    const [rows] = await db.query('SELECT a.*, p.type as package_type, u.name as parent_name FROM daycare_applications a LEFT JOIN daycare_packages p ON a.package_id = p.id LEFT JOIN users u ON a.parent_id = u.id WHERE a.daycare_id = ?', [daycareId])
    return rows
  }

  static async updateApplicationStatus(id, status) {
    await db.query('UPDATE daycare_applications SET status = ? WHERE id = ?', [status, id])
    if (status === 'approved') {
      // Create active child record
      const [app] = await db.query('SELECT * FROM daycare_applications WHERE id = ?', [id])
      if (app.length > 0) {
        await db.query(
          'INSERT INTO daycare_children (daycare_id, parent_id, child_name, child_age, package_id) VALUES (?, ?, ?, ?, ?)',
          [app[0].daycare_id, app[0].parent_id, app[0].child_name, app[0].child_age, app[0].package_id]
        )
      }
    }
  }

  static async getChildren(daycareId) {
    const [rows] = await db.query('SELECT c.*, p.type as package_type, u.name as parent_name FROM daycare_children c LEFT JOIN daycare_packages p ON c.package_id = p.id LEFT JOIN users u ON c.parent_id = u.id WHERE c.daycare_id = ?', [daycareId])
    return rows
  }

  static async getStaff(daycareId) {
    const [rows] = await db.query('SELECT * FROM daycare_staff WHERE daycare_id = ?', [daycareId])
    return rows
  }

  static async addStaff(daycareId, data) {
    const { user_id, role, phone, email } = data
    const [result] = await db.query(
      'INSERT INTO daycare_staff (daycare_id, user_id, role, phone, email) VALUES (?, ?, ?, ?, ?)',
      [daycareId, user_id, role, phone, email]
    )
    return result.insertId
  }

  static async getTransport(daycareId) {
    const [rows] = await db.query('SELECT * FROM daycare_transport WHERE daycare_id = ?', [daycareId])
    return rows
  }

  static async addTransport(daycareId, data) {
    const { van_number, driver_name, driver_phone, route } = data
    const [result] = await db.query(
      'INSERT INTO daycare_transport (daycare_id, van_number, driver_name, driver_phone, route) VALUES (?, ?, ?, ?, ?)',
      [daycareId, van_number, driver_name, driver_phone, route]
    )
    return result.insertId
  }

  static async getDailyReports(daycareId) {
    const [rows] = await db.query('SELECT r.*, c.child_name FROM daycare_daily_reports r JOIN daycare_children c ON r.child_id = c.id WHERE r.daycare_id = ? ORDER BY r.time_recorded DESC', [daycareId])
    return rows
  }

  static async addDailyReport(daycareId, data) {
    const { child_id, type, description, image_url } = data
    const [result] = await db.query(
      'INSERT INTO daycare_daily_reports (daycare_id, child_id, type, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [daycareId, child_id, type, description, image_url]
    )
    return result.insertId
  }
}

module.exports = DaycareModel
