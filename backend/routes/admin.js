const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { permit } = require('../middleware/roles')
const { 
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
} = require('../controllers/adminController')

// Protect all admin routes
router.use(auth)
router.use(permit('admin'))

// Metrics & Dashboard Overview
router.get('/metrics', getMetrics)

// User Management
router.get('/users', getUsers)

// Complaints
router.get('/complaints', getComplaints)
router.patch('/complaints/:id/resolve', resolveComplaint)

// Emergencies
router.get('/emergencies', getEmergencies)
router.patch('/emergencies/:id/resolve', resolveEmergency)

// Verifications
router.get('/verifications', getPendingVerifications)
router.patch('/verifications/:id', updateVerificationStatus)

// Ecosystem
router.get('/adoption', getAdoptions)
router.get('/marketplace', getMarketplace)

// User Moderation
router.put('/users/:id/action', takeUserAction)

module.exports = router
