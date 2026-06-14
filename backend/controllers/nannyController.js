const { upsertProfile, findByNanny } = require('../models/NannyProfile')
const { setAvailability, getAvailability } = require('../models/Availability')
const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../mockNannyProfiles.json');

let mockNannyProfiles = {}
let mockNannyAvailability = {}

try {
  if (fs.existsSync(mockFilePath)) {
    mockNannyProfiles = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
  }
} catch (e) {
  console.error('Failed to load mockNannyProfiles.json', e);
}

const saveMockProfiles = () => {
  try {
    fs.writeFileSync(mockFilePath, JSON.stringify(mockNannyProfiles, null, 2));
  } catch (e) {
    console.error('Failed to save mockNannyProfiles.json', e);
  }
};

const saveProfile = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { name, bio, experience, skills, photo_url, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken } = req.body
    const profileData = { nanny_id, name, bio, experience, skills, photo_url, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken, verified: false }
    const r = await upsertProfile(profileData)
    
    // Send global notification
    try {
      const pool = require('../config/db');
      await pool.query(
        "INSERT INTO parent_notifications (sender_role, title, message) VALUES (?, ?, ?)",
        ['nanny', 'New Nanny Profile', `${name} just joined and created a nanny profile.`]
      );
    } catch(err) { console.error('Notification error', err) }

    return res.json({ ok:true, data: r })
  }catch(err){ 
    const nanny_id = req.user.id
    const { name, bio, experience, skills, photo_url, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken } = req.body
    const profileData = { nanny_id, name, bio, experience, skills, photo_url, phone, dob, nationalId, nationality, address, city, state, zipCode, gender, workPreference, languagesSpoken, verified: false }
    mockNannyProfiles[nanny_id] = profileData
    saveMockProfiles();

    // Send global notification
    try {
      const pool = require('../config/db');
      await pool.query(
        "INSERT INTO parent_notifications (sender_role, title, message) VALUES (?, ?, ?)",
        ['nanny', 'New Nanny Profile', `${name} just joined and created a nanny profile.`]
      );
    } catch(err) { 
      console.error('Notification error', err.message);
      if (!global.mockParentNotifications) global.mockParentNotifications = [];
      global.mockParentNotifications.push({
        id: 'm_' + Date.now(),
        sender_role: 'nanny',
        title: 'New Nanny Profile',
        message: `${name} just joined and created a nanny profile.`,
        created_at: new Date().toISOString()
      });
    }

    return res.json({ ok:true, data: mockNannyProfiles[nanny_id], mock: true }) 
  }
}

const getProfile = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const p = await findByNanny(nanny_id)
    return res.json({ ok:true, data: p })
  }catch(err){ 
    const nanny_id = req.user.id
    return res.json({ ok:true, data: mockNannyProfiles[nanny_id] || null, mock: true }) 
  }
}

const saveAvailability = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const { availability } = req.body
    const r = await setAvailability({ nanny_id, availability })
    return res.json({ ok:true, data: r })
  }catch(err){ 
    const nanny_id = req.user.id
    const { availability } = req.body
    mockNannyAvailability[nanny_id] = availability
    return res.json({ ok:true, data: { nanny_id, availability }, mock: true }) 
  }
}

const getAvail = async (req, res) => {
  try{
    const nanny_id = req.user.id
    const a = await getAvailability(nanny_id)
    return res.json({ ok:true, data: a })
  }catch(err){ 
    const nanny_id = req.user.id
    return res.json({ ok:true, data: { nanny_id, availability: mockNannyAvailability[nanny_id] || [] }, mock: true }) 
  }
}

const getAgencies = async (req, res) => {
  const agencies = [
    { id: 1, name: 'Trust Nanny Network', logo: '🛡️', rating: 4.2, reviews: 28, location: 'Liverpool, AU', numNannies: 35, skills: ['Newborn Care', 'Teaching'], desc: 'Background checked professionals with certifications' },
    { id: 2, name: 'Caring Hearts Agency', logo: '❤️', rating: 4.7, reviews: 35, location: 'Queens, NY', numNannies: 45, skills: ['Newborn Care', 'Teaching'], desc: 'Premium verified nannies with background checks' },
    { id: 3, name: 'Elite Nanny Services', logo: '⭐', rating: 4.7, reviews: 35, location: 'Queens, NY', numNannies: 45, skills: ['Newborn Care', 'Teaching'], desc: 'Premium verified nannies with background checks' },
    { id: 4, name: 'WC Nanny Services', logo: '🍼', rating: 4.7, reviews: 35, location: 'Vienna, Italy', numNannies: 52, skills: ['Newborn Care', 'Teaching'], desc: 'Experienced nannies specializing in early childhood' },
    { id: 5, name: 'Nannies Glory', logo: '🌟', rating: 4.9, reviews: 65, location: 'Tokyo, Japan', numNannies: 39, skills: ['Newborn Care', 'Teaching'], desc: 'Get premium experience with care' },
    { id: 6, name: 'ROCH', logo: '🏛️', rating: 4.5, reviews: 20, location: 'Queens, NY', numNannies: 55, skills: ['Newborn Care', 'Teaching'], desc: 'Professional nannies with experience' },
  ]
  return res.json({ ok: true, data: agencies })
}

const getIndividualNannies = async (req, res) => {
  try {
    const pool = require('../config/db');
    const [rows] = await pool.query(`
      SELECT np.*, u.name 
      FROM nanny_profiles np 
      JOIN users u ON np.nanny_id = u.id
    `);
    
    let dbNannies = rows.map(r => {
      let skills = [];
      try { skills = JSON.parse(r.skills) } catch(e) {}
      return {
        id: r.nanny_id,
        name: r.name || 'Nanny',
        photo: r.photo_url || '👩',
        experience: r.experience || 'New',
        rating: 5.0,
        reviews: 0,
        location: 'Remote/Local',
        type: 'Flexible',
        rate: 'Negotiable',
        skills: skills
      }
    });

    if (dbNannies.length > 0) {
      return res.json({ ok: true, data: dbNannies });
    }
  } catch(e) {
    // Database not available or table doesn't exist, ignore and use mock
  }

  // Combine mock profiles created in memory
  let mockProfilesList = Object.values(mockNannyProfiles).map((p, idx) => ({
    id: p.nanny_id,
    name: p.name || 'Nanny User ' + p.nanny_id, 
    photo: p.photo_url || '👩',
    experience: p.experience || 'New',
    rating: 5.0,
    reviews: 0,
    location: 'Remote/Local',
    type: 'Flexible',
    rate: 'Negotiable',
    skills: p.skills || []
  }));

  const nannies = [
    ...mockProfilesList,
    { id: 101, name: 'Kamrun Nahar', photo: '👩', experience: '4+ years', rating: 4.8, reviews: 42, location: 'Kuril, Dhaka', type: 'Full-time', rate: '$25/hour', skills: ['Newborn Care', 'Teaching'] },
    { id: 102, name: 'Deedhity Dhara', photo: '👩‍🦰', experience: '7+ years', rating: 4.9, reviews: 78, location: 'Notun Bazar, Dhaka', type: 'Part-time', rate: '$40/hour', skills: ['Toddler Care', 'Cooking'] },
    { id: 103, name: 'Nusrat Parvin', photo: '👩‍🦱', experience: '3+ years', rating: 4.7, reviews: 35, location: 'Mirpur, Dhaka', type: 'Hourly', rate: '$22/hour', skills: ['Newborn Care', 'Teaching'] },
    { id: 104, name: 'Sadia Afrin', photo: '👩‍🦱', experience: '5+ years', rating: 4.8, reviews: 56, location: 'Chittagong', type: 'Full-time', rate: '$28/hour', skills: ['Toddler Care', 'Special Needs'] },
    { id: 105, name: 'Samanta Khan', photo: '👩', experience: '6+ years', rating: 5.0, reviews: 92, location: 'Tangail', type: 'Part-time', rate: '$32/hour', skills: ['Newborn Care', 'Cooking'] },
    { id: 106, name: 'Maria Mim', photo: '👩‍🦰', experience: '4+ years', rating: 4.6, reviews: 48, location: 'Gulshan, Dhaka', type: 'Full-time', rate: '$26/hour', skills: ['Teaching', 'Activities'] },
  ]
  return res.json({ ok: true, data: nannies })
}

const getFeaturedNannies = async (req, res) => {
  const nannies = [
    { id: 7, name: 'Adiba Irin', photo: '👩', experience: '5 years', rating: 4.8, reviews: 27, location: 'Dhaka', rate: '$25/hr', available: true },
    { id: 8, name: 'Fairuj Smiha', photo: '👩‍🦰', experience: '6 years', rating: 4.9, reviews: 54, location: 'Mirpur, Dhaka', rate: '$22/hr', available: true },
    { id: 9, name: 'Tamanna Khan', photo: '👩‍🦱', experience: '5 years', rating: 4.8, reviews: 56, location: 'Dhanmondi, Dhaka', rate: '$20/hr', available: true },
    { id: 10, name: 'Nargis Akter', photo: '👩', experience: '5 years', rating: 4.9, reviews: 82, location: 'Kakrail, Dhaka', rate: '$24/hr', available: true },
  ]
  return res.json({ ok: true, data: nannies })
}

const getNannyDetails = async (req, res) => {
  const { id } = req.params;
  const details = {
    id: id,
    name: 'Kamrun Nahar',
    title: 'Professional Childcare Specialist',
    photo: '👩',
    rating: 4.8,
    reviews: 42,
    location: 'Kuril, Dhaka',
    availability: 'Full-time',
    rate: '$25/hr',
    experience: '4+ years',
    languages: 3,
    about: 'Experienced and dedicated nanny with over 4 years of professional childcare experience. I have a passion for nurturing children\'s development through play-based learning and creating a safe, loving environment.',
    specializations: ['Newborn Care', 'Teaching'],
    weeklyAvailability: [
      { day: 'Monday', time: '8:00 AM - 6:00 PM', available: true },
      { day: 'Tuesday', time: '8:00 AM - 6:00 PM', available: true },
      { day: 'Wednesday', time: '8:00 AM - 6:00 PM', available: true },
      { day: 'Thursday', time: '8:00 AM - 6:00 PM', available: true },
      { day: 'Friday', time: '8:00 AM - 6:00 PM', available: true },
      { day: 'Saturday', time: 'Not Available', available: false },
      { day: 'Sunday', time: 'Not Available', available: false },
    ],
    certifications: [
      'CPR & First Aid Certified',
      'Early Childhood Education',
      'Newborn Care Specialist'
    ],
    knownLanguages: [
      { name: 'Bengali', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Hindi', level: 'Conversational' }
    ]
  }
  return res.json({ ok: true, data: details })
}

const getPayments = async (req, res) => {
  const paymentsData = {
    summaries: [
      { period: 'This week', amount: '$320', status: 'Pending' },
      { period: 'Last week', amount: '$450', status: 'Paid' },
      { period: 'This month', amount: '$1,240', status: 'In progress' }
    ],
    history: [
      { session: 'After-school care', date: 'May 20', amount: '$80', status: 'Paid' },
      { session: 'Weekend care', date: 'May 18', amount: '$140', status: 'Paid' }
    ]
  };
  return res.json({ ok: true, data: paymentsData });
}

// --- NEW FEATURE CONTROLLERS ---

const { createJob, findAllOpen } = require('../models/NannyJob')
const { startShift, endShift, getActiveShift } = require('../models/Shift')
const { logSafetyCheckin } = require('../models/Safety')
const { sendSos } = require('../models/Sos')

const postNannyJob = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { title, description, availability_date } = req.body
    const job = await createJob({ nanny_id, title, description, availability_date })
    return res.json({ ok: true, data: job })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const getNannyJobs = async (req, res) => {
  try {
    const jobs = await findAllOpen()
    return res.json({ ok: true, data: jobs })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const startNannyShift = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { job_id } = req.body
    const shift = await startShift({ nanny_id, job_id })
    return res.json({ ok: true, data: shift })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const endNannyShift = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { shift_id } = req.body
    const shift = await endShift(shift_id, nanny_id)
    return res.json({ ok: true, data: shift })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const safetyCheckin = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { status, location } = req.body
    const log = await logSafetyCheckin({ nanny_id, status, location })
    return res.json({ ok: true, data: log })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const triggerSos = async (req, res) => {
  try {
    const nanny_id = req.user.id
    const { lat, lng, message } = req.body
    const sos = await sendSos({ nanny_id, lat, lng, message })
    return res.json({ ok: true, data: sos })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

const getWellnessTools = async (req, res) => {
  const wellnessData = {
    stressLevel: 'Low',
    tips: [
      'Take deep breaths for 5 minutes',
      'Listen to relaxing music',
      'Stay hydrated'
    ],
    sessions: [
      { id: 1, title: 'Breathing Exercises', duration: '10 mins' },
      { id: 2, title: 'Mindful Meditation', duration: '15 mins' }
    ]
  };
  return res.json({ ok: true, data: wellnessData });
}

module.exports = { 
  saveProfile, getProfile, saveAvailability, getAvail, 
  getAgencies, getIndividualNannies, getFeaturedNannies, 
  getNannyDetails, getPayments,
  postNannyJob, getNannyJobs, startNannyShift, endNannyShift,
  safetyCheckin, triggerSos, getWellnessTools,
  mockNannyProfiles, saveMockProfiles
}
