const express = require('express');
const router = express.Router();
const { 
  getDaycares, getDaycareById, getChildReport, submitApplication, processPayment,
  ensureDaycare, getDashboardStats, getProfile, updateProfile, createProfile,
  getPackages, createPackage, getApplications, updateApplication, getChildren,
  getStaff, addStaff, getTransport, addTransport, getDailyReports, addDailyReport
} = require('../controllers/daycareController');
const authMiddleware = require('../middleware/authMiddleware');

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

router.get('/portal/transport', ensureDaycare, getTransport);
router.post('/portal/transport', ensureDaycare, addTransport);

router.get('/portal/reports', ensureDaycare, getDailyReports);
router.post('/portal/reports', ensureDaycare, addDailyReport);

module.exports = router;
