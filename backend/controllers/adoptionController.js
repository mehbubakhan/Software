const { Orphanage, Child, Application, Meetup, QaResponse, Document } = require('../models/AdoptionModel');

const adoptionController = {
  // Orphanages
  createOrphanage: async (req, res) => {
    try {
      const data = { ...req.body, created_by: req.user.id };
      const id = await Orphanage.create(data);
      res.status(201).json({ ok: true, id });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getOrphanages: async (req, res) => {
    try {
      const orphanages = await Orphanage.findAll();
      res.json({ ok: true, data: orphanages });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getOrphanageById: async (req, res) => {
    try {
      const orphanage = await Orphanage.findById(req.params.id);
      if (!orphanage) return res.status(404).json({ ok: false, message: 'Not found' });
      const children = await Child.findByOrphanage(req.params.id);
      res.json({ ok: true, data: { ...orphanage, children } });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getMyOrphanage: async (req, res) => {
    try {
      const orphanage = await Orphanage.findByUser(req.user.id);
      res.json({ ok: true, data: orphanage });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  // Children
  createChild: async (req, res) => {
    try {
      const data = req.body;
      const id = await Child.create(data);
      res.status(201).json({ ok: true, id });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getChildren: async (req, res) => {
    try {
      const children = await Child.findAll();
      res.json({ ok: true, data: children });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getChildById: async (req, res) => {
    try {
      const child = await Child.findById(req.params.id);
      if (!child) return res.status(404).json({ ok: false, message: 'Not found' });
      res.json({ ok: true, data: child });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  // Applications
  createApplication: async (req, res) => {
    try {
      const data = { ...req.body, parent_id: req.user.id };
      const id = await Application.create(data);
      res.status(201).json({ ok: true, id });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getApplications: async (req, res) => {
    try {
      if (req.user.role === 'parent') {
        const apps = await Application.findByParent(req.user.id);
        return res.json({ ok: true, data: apps });
      }
      
      const orphanage = await Orphanage.findByUser(req.user.id);
      if (orphanage) {
        const apps = await Application.findByOrphanage(orphanage.id);
        return res.json({ ok: true, data: apps });
      }
      res.json({ ok: true, data: [] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  updateApplicationStatus: async (req, res) => {
    try {
      await Application.updateStatus(req.params.id, req.body.status);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  // Meetups
  createMeetup: async (req, res) => {
    try {
      const data = { ...req.body, created_by: req.user.id };
      const id = await Meetup.create(data);
      res.status(201).json({ ok: true, id });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getApplicationMeetups: async (req, res) => {
    try {
      const meetups = await Meetup.findByApplication(req.params.id);
      res.json({ ok: true, data: meetups });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  // QA & Compatibility
  submitQA: async (req, res) => {
    try {
      const data = req.body;
      const id = await QaResponse.create(data);
      
      let score = 50; 
      if (data.parent_answers && data.parent_answers.length > 0) score += 20;
      if (data.orphanage_observations && data.orphanage_observations.length > 20) score += 15;
      await Application.updateCompatibility(data.application_id, Math.min(score, 100));

      res.status(201).json({ ok: true, id, compatibility_calculated: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  // Documents
  uploadDocument: async (req, res) => {
    try {
      // In MVP, we just receive the URL and type from frontend. 
      // In production, this would handle multer and S3 upload.
      const data = req.body; 
      const id = await Document.create(data);
      res.status(201).json({ ok: true, id });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  getApplicationDocuments: async (req, res) => {
    try {
      const documents = await Document.findByApplication(req.params.id);
      res.json({ ok: true, data: documents });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
};

module.exports = adoptionController;
