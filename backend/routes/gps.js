const express = require('express');
const router = express.Router();

let currentGpsLocation = {
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: null
};

// Nanny posts location
router.post('/update', (req, res) => {
  const { latitude, longitude, accuracy, timestamp } = req.body;
  if (latitude && longitude) {
    console.log(`Received GPS from phone: ${latitude}, ${longitude}`);
    currentGpsLocation = { latitude, longitude, accuracy, timestamp: timestamp || new Date().toISOString() };
  }
  res.json({ success: true });
});

// Parent gets location
router.get('/live', (req, res) => {
  res.json(currentGpsLocation);
});

module.exports = router;
