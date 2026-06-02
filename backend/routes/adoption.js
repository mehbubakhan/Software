const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { permit } = require('../middleware/roles');
const auth = require('../middleware/auth'); // default export

// Public/Parent reading
router.get('/orphanages', auth, adoptionController.getOrphanages);
router.get('/orphanages/:id', auth, adoptionController.getOrphanageById);
router.get('/children', auth, adoptionController.getChildren);
router.get('/children/:id', auth, adoptionController.getChildById);

// Orphanage Manager specific routes
router.post('/orphanages', auth, permit('orphanage_manager', 'orphanageManager', 'admin'), adoptionController.createOrphanage);
router.get('/manager/my-orphanage', auth, permit('orphanage_manager', 'orphanageManager', 'admin'), adoptionController.getMyOrphanage);
router.post('/children', auth, permit('orphanage_manager', 'orphanageManager', 'admin'), adoptionController.createChild);

// Applications
router.post('/applications', auth, permit('parent', 'admin'), adoptionController.createApplication);
router.post('/apply', auth, permit('parent', 'admin'), adoptionController.createApplication);
router.get('/applications', auth, adoptionController.getApplications);
router.patch('/applications/:id/status', auth, permit('orphanage_manager', 'orphanageManager', 'admin'), adoptionController.updateApplicationStatus);

// Meetups
router.post('/meetups', auth, permit('orphanage_manager', 'orphanageManager', 'admin'), adoptionController.createMeetup);
router.get('/applications/:id/meetups', auth, adoptionController.getApplicationMeetups);

// QA & Compatibility
router.post('/qa', auth, adoptionController.submitQA);

// Documents
router.post('/documents', auth, permit('parent', 'admin'), adoptionController.uploadDocument);
router.get('/applications/:id/documents', auth, adoptionController.getApplicationDocuments);

module.exports = router;
