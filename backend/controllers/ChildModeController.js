const db = require('../config/db');

exports.getOverview = async (req, res) => {
  try {
    const childId = req.query.childId || 1; // Default to 1 for demo if not provided
    
    // Fetch child info, progress, and rewards
    const [childRows] = await db.execute('SELECT * FROM children WHERE id = ?', [childId]);
    if (childRows.length === 0) {
      return res.status(404).json({ error: 'Child not found' });
    }
    const child = childRows[0];

    const [progressRows] = await db.execute('SELECT * FROM child_progress WHERE child_id = ?', [childId]);
    const [rewardsRows] = await db.execute('SELECT * FROM child_rewards WHERE child_id = ?', [childId]);

    const totalStars = progressRows.reduce((acc, curr) => acc + curr.stars, 0);
    const totalCoins = rewardsRows.reduce((acc, curr) => acc + curr.points, 0);

    res.json({
      child,
      progress: progressRows,
      rewards: rewardsRows,
      totalStars,
      totalCoins
    });
  } catch (error) {
    console.error('Child Overview Error:', error);
    res.status(500).json({ error: 'Failed to fetch child overview' });
  }
};

exports.getModules = async (req, res) => {
  try {
    res.json({
      modules: [
        { id: 'alphabet', title: 'Alphabet', status: 'available' },
        { id: 'drawing', title: 'Drawing Board', status: 'available' },
        { id: 'rhymes', title: 'Rhymes', status: 'available' },
        { id: 'games', title: 'Mini Games', status: 'available' }
      ]
    });
  } catch (error) {
    console.error('Modules Error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const childId = req.query.childId || 1;
    const [progressRows] = await db.execute('SELECT * FROM child_progress WHERE child_id = ?', [childId]);
    res.json({ progress: progressRows });
  } catch (error) {
    console.error('Progress Error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { childId, module, lesson, score, stars } = req.body;
    
    await db.execute(`
      INSERT INTO child_progress (child_id, module, lesson, score, stars, completed) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [childId, module, lesson, score, stars, score >= 50]);

    res.json({ success: true, message: 'Test submitted successfully' });
  } catch (error) {
    console.error('Submit Test Error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

exports.claimReward = async (req, res) => {
  try {
    const { childId, rewardType, points, item } = req.body;
    
    await db.execute(`
      INSERT INTO child_rewards (child_id, reward_type, points, unlocked_item)
      VALUES (?, ?, ?, ?)
    `, [childId, rewardType, -points, item]);

    res.json({ success: true, message: 'Reward claimed' });
  } catch (error) {
    console.error('Claim Reward Error:', error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
};
