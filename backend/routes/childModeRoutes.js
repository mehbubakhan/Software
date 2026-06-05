const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get child learning progress
router.get('/progress', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const [rows] = await db.query(
      'SELECT module, current_level FROM child_learning_progress WHERE parent_id = ?',
      [parentId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching child progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update child learning progress
router.post('/progress', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const { module, current_level } = req.body;
    
    // Check if progress exists
    const [existing] = await db.query(
      'SELECT id FROM child_learning_progress WHERE parent_id = ? AND module = ?',
      [parentId, module]
    );

    if (existing.length > 0) {
      // Update
      await db.query(
        'UPDATE child_learning_progress SET current_level = ?, last_accessed = NOW() WHERE parent_id = ? AND module = ?',
        [current_level, parentId, module]
      );
    } else {
      // Insert
      await db.query(
        'INSERT INTO child_learning_progress (parent_id, module, current_level) VALUES (?, ?, ?)',
        [parentId, module, current_level]
      );
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating child progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
