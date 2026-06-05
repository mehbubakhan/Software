const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST /api/upload
// Uploads a single file and returns the file path
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the path so the frontend can store it and use it to download/view
  // The frontend can construct the URL like: http://localhost:5001/uploads/filename
  res.json({ 
    success: true,
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = router;
