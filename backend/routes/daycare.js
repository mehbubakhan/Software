const express = require('express');
const router = express.Router();
const { 
  getDaycares, getDaycareById, getChildReport, submitApplication, processPayment,
  ensureDaycare, getDashboardStats, getProfile, updateProfile, createProfile,
  getPackages, createPackage, getApplications, updateApplication, getChildren,
  getStaff, addStaff, updateStaff, deleteStaff, getTransport, addTransport, getDailyReports, addDailyReport,
  getInvoices, addInvoice, updateInvoice, getComplaints, addComplaint, updateComplaint, getMessages, addMessage
} = require('../controllers/daycareController');
const authMiddleware = require('../middleware/auth');

// Public / Parent-facing routes
router.get('/', getDaycares);
router.get('/child/:childId/report', getChildReport);
router.post('/payment', processPayment);
router.get('/:id', getDaycareById);
router.post('/:id/apply', submitApplication);

// Daycare Portal Routes (Requires auth)
router.use('/portal', authMiddleware);

router.post('/portal/profile', createProfile);
router.get('/portal/profile', ensureDaycare, getProfile);
router.put('/portal/profile', ensureDaycare, updateProfile);

router.get('/portal/dashboard', ensureDaycare, getDashboardStats);

router.get('/portal/packages', ensureDaycare, getPackages);
router.post('/portal/packages', ensureDaycare, createPackage);

router.get('/portal/applications', ensureDaycare, getApplications);
router.put('/portal/applications/:id', ensureDaycare, updateApplication);

router.get('/portal/children', ensureDaycare, getChildren);

router.get('/portal/staff', ensureDaycare, getStaff);
router.post('/portal/staff', ensureDaycare, addStaff);
router.put('/portal/staff/:staffId', ensureDaycare, updateStaff);
router.delete('/portal/staff/:staffId', ensureDaycare, deleteStaff);

router.get('/portal/transport', ensureDaycare, getTransport);
router.post('/portal/transport', ensureDaycare, addTransport);

router.get('/portal/reports', ensureDaycare, getDailyReports);
router.post('/portal/reports', ensureDaycare, addDailyReport);

router.get('/portal/invoices', ensureDaycare, getInvoices);
router.post('/portal/invoices', ensureDaycare, addInvoice);
router.put('/portal/invoices/:id', ensureDaycare, updateInvoice);

router.get('/portal/complaints', ensureDaycare, getComplaints);
router.post('/portal/complaints', ensureDaycare, addComplaint);
router.put('/portal/complaints/:id', ensureDaycare, updateComplaint);

router.get('/portal/messages', ensureDaycare, getMessages);
router.post('/portal/messages', ensureDaycare, addMessage);

module.exports = router;
