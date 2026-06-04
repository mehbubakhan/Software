const express = require('express');
const router = express.Router();
const { Application, Document, Meetup } = require('../models/AdoptionModel');
const { permit } = require('../middleware/roles');
const auth = require('../middleware/auth'); 

// Document Verification (Verification Officer)
router.patch('/documents/:id/verify', auth, permit('verification_officer', 'super_admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await Document.updateStatus(req.params.id, status, req.user.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Update Application Status (Legal Officer / Super Admin / Counsellor)
router.patch('/applications/:id/status', auth, permit('legal_officer', 'counsellor', 'super_admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await Application.updateStatus(req.params.id, status);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
