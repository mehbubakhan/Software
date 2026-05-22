const express = require('express');
const router = express.Router();
const { getDaycares, getDaycareById, getChildReport, submitApplication, processPayment } = require('../controllers/daycareController');

// In a real app we would use auth middleware
// const auth = require('../middleware/auth');

router.get('/', getDaycares);
router.get('/child/:childId/report', getChildReport);
router.post('/payment', processPayment);
router.get('/:id', getDaycareById);
router.post('/:id/apply', submitApplication);

module.exports = router;
