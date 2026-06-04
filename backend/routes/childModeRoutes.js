const express = require('express');
const router = express.Router();
const childModeController = require('../controllers/ChildModeController');

// Child Mode API endpoints
router.get('/overview', childModeController.getOverview);
router.get('/modules', childModeController.getModules);
router.get('/progress', childModeController.getProgress);
router.post('/test/submit', childModeController.submitTest);
router.post('/reward/claim', childModeController.claimReward);

module.exports = router;
