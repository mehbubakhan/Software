const pool = require('../config/db')

const parentSummary = async (req, res) => {
  try{
    const parent_id = req.user.id
    const [children] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [parent_id])
    return res.json({ ok:true, summary: { childrenCount: children.length, children } })
  }catch(err){ 
    return res.json({ ok:true, summary: { childrenCount: 0, children: [] }, mock: true }) 
  }
}

const adminSummary = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [nannies] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role="nanny"');
    const [parents] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role="parent"');
    const [organizations] = await pool.query('SELECT COUNT(*) as count FROM organizations');
    const [alerts] = await pool.query('SELECT COUNT(*) as count FROM emergency_alerts WHERE status="active"');
    const [admissions] = await pool.query('SELECT COUNT(*) as count FROM admissions WHERE status="pending"');
    const [jobs] = await pool.query('SELECT COUNT(*) as count FROM jobs WHERE status="open"');

    return res.json({ 
      ok: true, 
      summary: { 
        totalUsers: users[0].count,
        totalNannies: nannies[0].count,
        totalParents: parents[0].count,
        totalOrganizations: organizations[0].count,
        activeAlerts: alerts[0].count,
        pendingAdmissions: admissions[0].count, 
        openJobs: jobs[0].count 
      } 
    });
  } catch(err) { 
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const nannySummary = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const [assigned] = await pool.query('SELECT COUNT(*) as assigned FROM work_sessions WHERE nanny_id = ?', [nanny_id])
    return res.json({ ok:true, summary: { assignedCount: assigned[0].assigned } })
  }catch(err){ 
    return res.status(500).json({ ok: false, error: err.message }) 
  }
}

// ═══════════════════════════════════════════════════
// PARENT OVERVIEW — comprehensive parent dashboard data
// ═══════════════════════════════════════════════════
const getParentOverview = async (req, res) => {
  try {
    const parent_id = req.user?.id || 1;
    let dbChildren = [];
    try {
      [dbChildren] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [parent_id]);
    } catch (dbErr) {
      console.warn("DB unreachable, using mock children array.");
    }
    
    let children = dbChildren.map(c => ({
      id: c.id,
      name: c.name,
      age: c.dob ? Math.floor((new Date() - new Date(c.dob).getTime()) / 3.15576e+10) + ' years old' : '2 years old',
      currentDaycare: 'Sunshine Daycare',
      nextActivity: 'Art Class • Tomorrow 10:00 AM',
      healthStatus: 'All vaccinations up to date'
    }));

    if (children.length === 0) {
      children = [
        { id: '1', name: 'Md Reza', age: '2 years old', currentDaycare: 'Sunshine Daycare', nextActivity: 'Art Class • Tomorrow 10:00 AM', healthStatus: 'All vaccinations up to date' },
        { id: '2', name: 'Evan Jakaria', age: '4 years old', currentDaycare: 'Little Stars Center', nextActivity: 'Music Session • Jan 12, 2:00 PM', healthStatus: 'Checkup scheduled Jan 21' }
      ]
    }

    // Fetch real order data
    let recentOrders = [];
    try {
      const [orders] = await pool.query(`
        SELECT o.id, o.tracking_number, o.status, o.total_amount, o.created_at,
               GROUP_CONCAT(p.name SEPARATOR ', ') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC LIMIT 3
      `, [parent_id]);
      recentOrders = orders.map(o => ({
        id: o.id,
        orderId: '#' + o.tracking_number,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        item: o.items || 'Unknown Product',
        date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        price: '৳' + Number(o.total_amount).toLocaleString()
      }));
    } catch(e) {}

    if (recentOrders.length === 0) {
      recentOrders = [
        { id: 1, orderId: '#ORD-2456', status: 'Delivered', item: 'Baby Stroller - Premium', date: 'Jan 8, 2026', price: '$289.99' },
        { id: 2, orderId: '#ORD-2457', status: 'In Transit', item: 'Organic Baby Food Set', date: 'Jan 7, 2026', price: '$49.99' },
        { id: 3, orderId: '#ORD-2458', status: 'Processing', item: 'Educational Toys Bundle', date: 'Jan 6, 2026', price: '$149.99' }
      ];
    }

    // Fetch real work session count for stats
    let activeBookings = 0;
    try {
      const [ws] = await pool.query("SELECT COUNT(*) as c FROM work_sessions WHERE parent_id = ? AND status = 'active'", [parent_id]);
      activeBookings = ws[0].c;
    } catch(e) {}

    const data = {
      user: { name: req.user?.name || 'Sarah' },
      children,
      stats: {
        activeBookings: activeBookings || 2,
        messages: 5,
        notifications: 12,
        weeklyHours: 8,
        nanniesHired: 1,
        daycareAdmins: 1,
        pendingOrders: recentOrders.filter(o => o.status === 'Pending').length || 3,
        completionOrders: 45
      },
      nannyBookings: [
        { id: 1, name: 'Kamrun Nahar', date: 'Today', time: '09:00 - 14:00', status: 'Confirmed' },
        { id: 2, name: 'Deedhity Dhara', date: 'Tomorrow', time: '11:00 - 15:00', status: 'Pending' }
      ],
      daycareUpdates: [
        { id: 1, title: 'Lunch & Nap Time', location: 'Sunshine Daycare', time: 'Today, 12:30 PM', icon: '🥣', color: 'blue' },
        { id: 2, title: 'Art & Crafts Session', location: 'Little Stars Center', time: 'Today, 2:00 PM', icon: '🎨', color: 'purple' }
      ],
      upcomingSchedule: [
        { id: 1, title: 'Parent/Teacher Meetup', date: 'Jun 10, 2026 • 10:00 AM', location: 'Sunshine Daycare', icon: '📅', color: 'blue' },
        { id: 2, title: 'Daycare Board Meeting', date: 'Jun 12, 2026 • 2:00 PM', location: 'Sunshine Daycare', icon: '🏢', color: 'purple' },
        { id: 3, title: 'Baby Vaccination Reminder', date: 'Jun 15, 2026 • 11:00 AM', location: 'City Health Clinic', icon: '🏥', color: 'pink' },
        { id: 4, title: 'Immunization Schedule', date: 'Jun 16, 2026 • 2:00 PM', location: "Dr. Smith's Clinic", icon: '💉', color: 'green' }
      ],
      recentActivities: [
        { id: 1, text: 'Interview scheduled with Sarah Johnson', time: '2 hours ago', icon: '💬' },
        { id: 2, text: 'Daily activity report received', time: '4 hours ago', icon: '📝' },
        { id: 3, text: 'Order #' + (recentOrders[0]?.orderId || 'ORD-1254') + ' shipped', time: '8 hours ago', icon: '📦' },
        { id: 4, text: 'Payment reminder: Monthly Daycare fee', time: '1 day ago', icon: '💰' }
      ],
      recentOrders
    };

    return res.json({ ok: true, data });
  } catch (err) {
    return res.json({ ok: false, error: err.message, mock: true });
  }
}

// ═══════════════════════════════════════════════════
// CHILD PROFILE — detailed child view
// ═══════════════════════════════════════════════════
const getChildProfile = async (req, res) => {
  try {
    const childId = req.params.id;
    
    // Try to get real child data
    let childData = null;
    try {
      const [rows] = await pool.query('SELECT * FROM children WHERE id = ?', [childId]);
      if (rows.length > 0) childData = rows[0];
    } catch(e) {}
    
    const childName = childData ? childData.name : (childId === '2' ? 'Evan Jakaria' : 'Md Reza');
    const childAge = childData?.dob ? Math.floor((new Date() - new Date(childData.dob).getTime()) / 3.15576e+10) + ' years old' : (childId === '2' ? '4 years old' : '2 years old');

    const data = {
      profile: {
        id: childId,
        name: childName,
        level: 'Level 28',
        age: childAge,
        currentDaycare: childId === '2' ? 'Little Stars Center' : 'Sunshine Daycare',
        nextActivity: childId === '2' ? 'Music Session' : 'Art Class',
        healthStatus: 'All vaccinations up to date'
      },
      overviewStats: {
        mealsCompleted: '3/3',
        napTimeToday: '2.5 hrs',
        activitiesDone: 5,
        learningSessions: 3
      },
      recentActivities: [
        { title: 'Outdoor Play', time: '2:30 PM', icon: '🏃', color: 'green' },
        { title: 'Lunch - Ate everything!', time: '1:00 PM', icon: '🍽️', color: 'blue' },
        { title: 'Art Class - Finger Painting', time: '11:30 AM', icon: '🎨', color: 'purple' },
        { title: 'Alphabet Learning', time: '10:00 AM', icon: '🔤', color: 'red' },
        { title: 'Morning Snack', time: '9:00 AM', icon: '🥪', color: 'blue' }
      ],
      liveUpdates: [
        { title: 'Teacher Update', description: `${childName} is doing great in art class today! Very creative with colors.`, time: '5 minutes ago', icon: '👨‍🏫', color: 'blue' }
      ],
      weeklyProgress: {
        learningData: [
          { label: 'Alphabet', percent: 75 },
          { label: 'Numbers', percent: 60 },
          { label: 'Colors', percent: 90 },
          { label: 'Shapes', percent: 85 },
          { label: 'Words', percent: 55 }
        ],
        stats: { totalActivities: 41, learningHours: 23, avgSleep: '8.1 hrs' }
      },
      schedule: {
        upcoming: [
          { label: 'Art Class', location: 'Sunshine Daycare', date: 'Tomorrow', time: '10:00 AM', icon: '🎨', color: 'text-purple-400', bg: 'bg-purple-500/20' },
          { label: 'Music & Movement', location: 'Sunshine Daycare', date: 'Jun 20', time: '2:00 PM', icon: '🎵', color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Pediatric Checkup', location: 'City Hospital', date: 'Jun 21', time: '11:00 AM', icon: '🏥', color: 'text-green-400', bg: 'bg-green-500/20' }
        ],
        routine: [
          { time: '8:00 AM', label: 'Drop-off & Morning Circle', icon: '🕒' },
          { time: '9:00 AM', label: 'Breakfast & Snack Time', icon: '🥣' },
          { time: '10:00 AM', label: 'Learning Activities', icon: '📚' },
          { time: '12:00 PM', label: 'Lunch Time', icon: '🍽️' },
          { time: '1:00 PM', label: 'Nap Time', icon: '😴' },
          { time: '3:00 PM', label: 'Outdoor Play', icon: '🏃‍♂️' },
          { time: '4:00 PM', label: 'Art & Creativity', icon: '🎨' },
          { time: '5:00 PM', label: 'Pick-up Time', icon: '🚗' }
        ]
      },
      health: {
        stats: {
          vaccinations: 'Up to date',
          nextVaccination: 'Next: MMR Booster in 6 months',
          height: '87 cm', heightPercentile: '55th percentile',
          weight: '12.5 kg', weightPercentile: '90th percentile'
        },
        upcomingEvents: [
          { label: 'Pediatric Checkup', date: 'Jun 21, 2026', icon: '🩺' },
          { label: 'Dental Checkup', date: 'Jul 5, 2026', icon: '🦷' },
          { label: 'MMR Booster Vaccination', date: 'Dec 18, 2026', icon: '💉' }
        ],
        notes: [
          { type: 'Allergies', text: 'No known allergies', icon: '⚠️', color: 'yellow' },
          { type: 'Blood Type', text: 'A+', icon: '🩸', color: 'red' },
          { type: 'Notes', text: 'Prefers quiet activities in the afternoon. Loves art and music.', icon: '📝', color: 'blue' }
        ]
      }
    };

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// ═══════════════════════════════════════════════════
// NANNY OVERVIEW — comprehensive nanny dashboard data
// ═══════════════════════════════════════════════════
const nannyOverview = async (req, res) => {
  try {
    const nanny_id = req.user.id;
    const nannyName = req.user.name || 'Nanny';

    // Active work sessions
    let activeJobs = [];
    try {
      const [sessions] = await pool.query(`
        SELECT ws.id, ws.start_time, ws.status, u.name as family_name, 
               p.address as location
        FROM work_sessions ws
        JOIN users u ON ws.parent_id = u.id
        LEFT JOIN parents p ON ws.parent_id = p.user_id
        WHERE ws.nanny_id = ? AND ws.status = 'active'
      `, [nanny_id]);
      activeJobs = sessions.map(s => ({
        family: s.family_name + ' Family',
        area: s.location || 'Dhaka',
        duration: 'Active Session',
        rate: 'In progress'
      }));
    } catch(e) {}

    // Earnings from completed sessions
    let totalEarnings = 0;
    let sessionsCount = 0;
    let totalHours = 0;
    try {
      const [stats] = await pool.query(`
        SELECT COUNT(*) as sessions, 
               SUM(TIMESTAMPDIFF(HOUR, start_time, COALESCE(end_time, NOW()))) as hours
        FROM work_sessions 
        WHERE nanny_id = ? AND status = 'completed'
      `, [nanny_id]);
      sessionsCount = stats[0].sessions;
      totalHours = stats[0].hours || 0;
    } catch(e) {}

    // Nanny profile data
    let profile = {};
    try {
      const [np] = await pool.query('SELECT * FROM nanny_profiles WHERE user_id = ?', [nanny_id]);
      if (np.length > 0) profile = np[0];
    } catch(e) {}

    // Recent activities from work sessions
    let recentActivities = [];
    try {
      const [sessions] = await pool.query(`
        SELECT ws.*, u.name as parent_name 
        FROM work_sessions ws 
        JOIN users u ON ws.parent_id = u.id 
        WHERE ws.nanny_id = ? 
        ORDER BY ws.start_time DESC LIMIT 5
      `, [nanny_id]);
      recentActivities = sessions.map((s, i) => ({
        id: i + 1,
        text: s.status === 'active' ? `Active session with ${s.parent_name}` : `Completed session with ${s.parent_name}`,
        time: getTimeAgo(s.start_time),
        color: s.status === 'active' ? 'green' : 'blue'
      }));
    } catch(e) {}

    // We would normally aggregate from DB here, but for now we will query work_sessions for history
    let earningsHistory = [];
    try {
      const [history] = await pool.query(`
        SELECT DATE_FORMAT(start_time, '%b') as month, 
               SUM(TIMESTAMPDIFF(HOUR, start_time, COALESCE(end_time, NOW())) * 200) as earnings,
               SUM(TIMESTAMPDIFF(HOUR, start_time, COALESCE(end_time, NOW()))) as hours
        FROM work_sessions 
        WHERE nanny_id = ? AND status = 'completed'
        GROUP BY DATE_FORMAT(start_time, '%b')
        ORDER BY MAX(start_time) DESC
        LIMIT 6
      `, [nanny_id]);
      earningsHistory = history.reverse(); // chronological order
    } catch (e) {}

    return res.json({
      ok: true,
      data: {
        name: nannyName,
        activeJobs,
        stats: {
          totalSessions: sessionsCount || 0,
          totalHours: totalHours || 0,
          rating: profile.compatibility_score ? (profile.compatibility_score / 20).toFixed(1) : '0.0',
          verified: profile.verification_status === 'approved',
          availabilityStatus: profile.availability_status || 'Offline'
        },
        earningsHistory,
        recentActivities
      }
    });
  } catch (err) {
    console.error('[Dashboard] nannyOverview error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' mins ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
  return Math.floor(seconds / 86400) + ' days ago';
}

module.exports = { parentSummary, adminSummary, nannySummary, getParentOverview, getChildProfile, nannyOverview }
