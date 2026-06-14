const pool = require('../config/db')
const fs = require('fs')
const path = require('path')

const mockFilePath = path.join(__dirname, '..', 'mockProfiles.json')
let mockProfiles = {}
try {
  if (fs.existsSync(mockFilePath)) {
    mockProfiles = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'))
  }
} catch (e) {}

const getMockProfiles = () => {
  try {
    if (fs.existsSync(mockFilePath)) {
      return JSON.parse(fs.readFileSync(mockFilePath, 'utf8'))
    }
  } catch (e) {}
  return mockProfiles
}

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
  try{
    const [admissions] = await pool.query('SELECT COUNT(*) as pending FROM admissions WHERE status="pending"')
    const [jobs] = await pool.query('SELECT COUNT(*) as openJobs FROM jobs WHERE status="open"')
    return res.json({ ok:true, summary: { pendingAdmissions: admissions[0].pending, openJobs: jobs[0].openJobs } })
  }catch(err){ 
    return res.json({ ok:true, summary: { pendingAdmissions: 2, openJobs: 5 }, mock: true }) 
  }
}

const nannySummary = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const [assigned] = await pool.query('SELECT COUNT(*) as assigned FROM activities WHERE nanny_id = ?', [nanny_id])
    return res.json({ ok:true, summary: { assignedCount: assigned[0].assigned } })
  }catch(err){ 
    return res.json({ ok:true, summary: { assignedCount: 3 }, mock: true }) 
  }
}

// Seeded Data Endpoints for Parent Dashboard Visuals
const getParentOverview = async (req, res) => {
  try {
    const parent_id = req.user?.id || 1;
    
    // 1. Fetch children
    let dbChildren = [];
    try {
      [dbChildren] = await pool.query('SELECT * FROM children WHERE parent_id = ?', [parent_id]);
    } catch (dbErr) {
      console.warn("DB unreachable for children, using mock.", dbErr.message);
    }
    
    let children = dbChildren.map(c => ({
      id: c.id,
      name: c.name,
      age: c.dob ? Math.floor((new Date() - new Date(c.dob).getTime()) / 3.15576e+10) + ' years old' : 'Age unknown',
      currentDaycare: 'Not enrolled',
      nextActivity: 'None scheduled',
      healthStatus: 'Up to date'
    }));

    if (children.length === 0) {
      const currentMockProfiles = getMockProfiles();
      const mockProfile = currentMockProfiles[parent_id] || {};
      children = [
        { 
          id: '1', 
          name: mockProfile.childName || 'Demo Child', 
          age: (mockProfile.childAge ? mockProfile.childAge : '2') + ' years old', 
          currentDaycare: 'Sunshine Daycare', 
          nextActivity: 'Art Class • Tomorrow 10:00 AM', 
          healthStatus: 'All vaccinations up to date' 
        }
      ];
    }

    // 2. Fetch Stats
    const [[{ activeBookings }]] = await pool.query("SELECT COUNT(*) as activeBookings FROM parent_job_posts WHERE parent_id = ? AND status != 'closed'", [parent_id]);
    const [[{ nanniesHired }]] = await pool.query("SELECT COUNT(*) as nanniesHired FROM parent_job_posts WHERE parent_id = ? AND status = 'filled'", [parent_id]);
    const [[{ pendingOrders }]] = await pool.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE user_id = ? AND status = 'Pending'", [parent_id]);
    const [[{ totalOrders, deliveredOrders }]] = await pool.query("SELECT COUNT(*) as totalOrders, SUM(CASE WHEN status='Delivered' THEN 1 ELSE 0 END) as deliveredOrders FROM orders WHERE user_id = ?", [parent_id]);
    const [[{ notificationsCount }]] = await pool.query("SELECT COUNT(*) as notificationsCount FROM admin_notifications"); // Or specific to user

    const completionOrders = totalOrders > 0 ? Math.round((deliveredOrders || 0) / totalOrders * 100) : 0;

    // 3. Fetch Nanny Bookings (using job posts as proxy for now)
    const [dbBookings] = await pool.query("SELECT id, title, created_at, status FROM parent_job_posts WHERE parent_id = ? ORDER BY created_at DESC LIMIT 3", [parent_id]);
    const nannyBookings = dbBookings.map(b => ({
      id: b.id,
      name: b.title,
      date: new Date(b.created_at).toLocaleDateString(),
      time: new Date(b.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: b.status === 'filled' ? 'Confirmed' : 'Pending'
    }));

    // 4. Fetch Daycare Updates
    let daycareUpdates = [];
    if (dbChildren.length > 0) {
      const childIds = dbChildren.map(c => c.id);
      const [dbUpdates] = await pool.query(`SELECT id, type, description, time_recorded FROM daycare_daily_reports WHERE child_id IN (?) ORDER BY time_recorded DESC LIMIT 3`, [childIds]);
      daycareUpdates = dbUpdates.map(u => ({
        id: u.id,
        title: u.type + ' Update',
        location: u.description || 'Daycare Center',
        time: new Date(u.time_recorded).toLocaleString(),
        icon: u.type === 'meal' ? '🥣' : (u.type === 'sleep' ? '😴' : '🎨'),
        color: 'blue'
      }));
    }

    // 5. Fetch Upcoming Schedule (Meetups)
    const [dbMeetups] = await pool.query("SELECT id, meetup_date, meetup_time, location, meeting_type FROM adoption_meetups WHERE created_by = ? ORDER BY meetup_date ASC LIMIT 3", [parent_id]);
    const upcomingSchedule = dbMeetups.map(m => ({
      id: m.id,
      title: 'Adoption Meetup',
      date: m.meetup_date ? new Date(m.meetup_date).toLocaleDateString() + ' • ' + (m.meetup_time || '') : 'TBD',
      location: m.meeting_type === 'virtual' ? 'Virtual Meeting' : (m.location || 'TBD'),
      icon: '📅',
      color: 'purple'
    }));

    // 6. Fetch Recent Activities
    let recentActivities = [];
    if (dbChildren.length > 0) {
      const childIds = dbChildren.map(c => c.id);
      const [dbActivities] = await pool.query(`SELECT id, type as text, created_at as time FROM activities WHERE child_id IN (?) ORDER BY created_at DESC LIMIT 4`, [childIds]);
      recentActivities = dbActivities.map(a => ({
        id: a.id,
        text: a.text || 'Activity logged',
        time: new Date(a.time).toLocaleString(),
        icon: '📝'
      }));
    }

    // 7. Fetch Recent Orders
    let recentOrders = [];
    try {
      const [dbOrders] = await pool.query("SELECT id, tracking_number, status, total_amount, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 3", [parent_id]);
      recentOrders = dbOrders.map(o => ({
        id: o.id,
        orderId: o.tracking_number,
        status: o.status,
        item: 'Marketplace Order',
        date: new Date(o.created_at).toLocaleDateString(),
        price: '$' + parseFloat(o.total_amount).toFixed(2),
        items: [] // In a real scenario we'd query order_items
      }));
    } catch (e) {
      console.warn('DB Orders error, skipping db orders in overview', e.message);
    }

    if (global.mockOrders) {
      const parentMockOrders = global.mockOrders.filter(o => o.user_id == parent_id).map(o => ({
        id: o.id,
        orderId: o.tracking_number,
        status: o.status || 'Pending',
        item: o.items && o.items[0] ? o.items[0].name || 'Marketplace Order' : 'Marketplace Order',
        date: new Date(o.created_at || Date.now()).toLocaleDateString(),
        price: '$' + parseFloat(o.total_amount).toFixed(2),
        items: o.items || []
      }));
      recentOrders = [...parentMockOrders.reverse(), ...recentOrders].slice(0, 3);
    }

    const currentMockProfiles = getMockProfiles();
    const mockProfile = currentMockProfiles[parent_id] || {};
    const data = {
      user: { name: mockProfile.name || req.user?.name || 'Parent' },
      children,
      stats: {
        activeBookings: activeBookings || 0,
        messages: 0,
        notifications: notificationsCount || 0,
        weeklyHours: 0,
        nanniesHired: nanniesHired || 0,
        daycareAdmins: 0,
        pendingOrders: pendingOrders || 0,
        completionOrders: completionOrders
      },
      nannyBookings: nannyBookings.length ? nannyBookings : [],
      daycareUpdates: daycareUpdates.length ? daycareUpdates : [],
      upcomingSchedule: upcomingSchedule.length ? upcomingSchedule : [],
      recentActivities: recentActivities.length ? recentActivities : [],
      recentOrders: recentOrders.length ? recentOrders : []
    };

    return res.json({ ok: true, data });
  } catch (err) {
    console.error("getParentOverview Error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

const getChildProfile = async (req, res) => {
  try {
    const childId = req.params.id;
    // Serve seeded data matching the child
    const data = {
      profile: {
        id: childId,
        name: childId === '2' ? 'Evan Jakaria' : 'Md Reza',
        level: 'Level 28',
        age: childId === '2' ? '4 years old' : '2 years old',
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
        { title: 'Teacher Update', description: `${childId === '2' ? 'Evan' : 'Md Reza'} is doing great in art class today! Very creative with colors.`, time: '5 minutes ago', icon: '👨‍🏫', color: 'blue' }
      ],
      weeklyProgress: {
        learningData: [
          { label: 'Alphabet', percent: 75 },
          { label: 'Numbers', percent: 60 },
          { label: 'Colors', percent: 90 },
          { label: 'Shapes', percent: 85 },
          { label: 'Words', percent: 55 }
        ],
        stats: {
          totalActivities: 41,
          learningHours: 23,
          avgSleep: '8.1 hrs'
        }
      },
      schedule: {
        upcoming: [
          { label: 'Art Class', location: 'Sunshine Daycare', date: 'Tomorrow', time: '10:00 AM', icon: '🎨', color: 'text-purple-400', bg: 'bg-purple-500/20' },
          { label: 'Music & Movement', location: 'Sunshine Daycare', date: 'Feb 20', time: '2:00 PM', icon: '🎵', color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Pediatric Checkup', location: 'City Hospital', date: 'Feb 21', time: '11:00 AM', icon: '🏥', color: 'text-green-400', bg: 'bg-green-500/20' },
          { label: 'Storytelling Session', location: 'Sunshine Daycare', date: 'Feb 22', time: '3:00 PM', icon: '📚', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
          { label: 'Outdoor Play Day', location: 'Central Park', date: 'Feb 23', time: '9:00 AM', icon: '🏃', color: 'text-orange-400', bg: 'bg-orange-500/20' }
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
          height: '87 cm',
          heightPercentile: '55th percentile',
          weight: '12.5 kg',
          weightPercentile: '90th percentile'
        },
        upcomingEvents: [
          { label: 'Pediatric Checkup', date: 'Feb 21, 2026', icon: '🩺' },
          { label: 'Dental Checkup', date: 'Mar 5, 2026', icon: '🦷' },
          { label: 'MMR Booster Vaccination', date: 'Aug 18, 2026', icon: '💉' }
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

module.exports = { parentSummary, adminSummary, nannySummary, getParentOverview, getChildProfile }
