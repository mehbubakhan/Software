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
    // We fetch real children from DB, but map them to the UI structure. If none, we provide fallbacks.
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

    const data = {
      user: { name: req.user?.name || 'Sarah' },
      children,
      stats: {
        activeBookings: 2,
        messages: 5,
        notifications: 12,
        weeklyHours: 8,
        nanniesHired: 1,
        daycareAdmins: 1,
        pendingOrders: 3,
        completionOrders: 45
      },
      nannyBookings: [
        { id: 1, name: 'Maria Rodriguez', date: 'Jan 10, 2026', time: '09:00 - 14:00', status: 'Confirmed' },
        { id: 2, name: 'Emma Watson', date: 'Jan 12, 2026', time: '11:00 - 15:00', status: 'Pending' }
      ],
      daycareUpdates: [
        { id: 1, title: 'Lunch & Nap Time', location: 'Sunshine Daycare', time: 'Oct 3, 12:30 PM', icon: '🥣', color: 'blue' },
        { id: 2, title: 'Art & Crafts Session', location: 'Little Stars Center', time: 'Oct 3, 2:00 PM', icon: '🎨', color: 'purple' }
      ],
      upcomingSchedule: [
        { id: 1, title: 'Parent/Teacher Meetups - Sarah Johnson', date: 'Jan 12, 2026 • 10:00 AM', location: 'Zoom Meeting', icon: '📅', color: 'blue' },
        { id: 2, title: 'Daycare Board Meeting', date: 'Jan 12, 2026 • 2:00 PM', location: 'Sunshine Daycare', icon: '🏢', color: 'purple' },
        { id: 3, title: 'Baby Vaccination Reminder', date: 'Jan 15, 2026 • 11:00 AM', location: 'City Health Clinic', icon: '🏥', color: 'pink' },
        { id: 4, title: 'Immunization Schedule', date: 'Jan 16, 2026 • 2:00 PM', location: 'Dr. Smith\'s Clinic', icon: '💉', color: 'green' }
      ],
      recentActivities: [
        { id: 1, text: 'Interview scheduled with Sarah Johnson', time: '2 hours ago', icon: '💬' },
        { id: 2, text: 'Daily activity report received', time: '4 hours ago', icon: '📝' },
        { id: 3, text: 'Order #1254 shipped', time: '8 hours ago', icon: '📦' },
        { id: 4, text: 'Payment reminder: Monthly Daycare fee', time: '1 day ago', icon: '💰' }
      ],
      recentOrders: [
        { id: 1, orderId: '#ORD-2456', status: 'Delivered', item: 'Baby Stroller - Premium', date: 'Jan 8, 2026', price: '$289.99' },
        { id: 2, orderId: '#ORD-2457', status: 'In Transit', item: 'Organic Baby Food Set', date: 'Jan 7, 2026', price: '$49.99' },
        { id: 3, orderId: '#ORD-2458', status: 'Processing', item: 'Educational Toys Bundle', date: 'Jan 6, 2026', price: '$149.99' }
      ]
    };

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: (typeof err !== 'undefined' ? err.message : (typeof error !== 'undefined' ? error.message : 'Internal error')) });
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
