const DaycareModel = require('../models/DaycareModel')

const getDaycares = (req, res) => {
  const daycares = [
    {
      id: 1,
      name: "Little Stars Daycare",
      rating: 4.8,
      reviews: 124,
      location: "2.5 miles",
      hours: "7:00 AM - 6:00 PM",
      childrenEnrolled: "42 children enrolled",
      price: "$1200/month",
      transportAvailable: true,
      image: "🏠", // Placeholder for actual image
      tags: ["Verified", "Live CCTV"]
    },
    {
      id: 2,
      name: "Bright Beginnings Center",
      rating: 4.9,
      reviews: 86,
      location: "3.2 miles",
      hours: "7:30 AM - 5:30 PM",
      childrenEnrolled: "35 children enrolled",
      price: "$1100/month",
      transportAvailable: true,
      image: "☀️",
      tags: ["Featured", "Live CCTV"]
    },
    {
      id: 3,
      name: "Happy Hearts Childcare",
      rating: 4.7,
      reviews: 92,
      location: "4.0 miles",
      hours: "7:00 AM - 6:00 PM",
      childrenEnrolled: "50 children enrolled",
      price: "$1050/month",
      transportAvailable: false,
      image: "❤️",
      tags: ["Verified", "Live CCTV"]
    },
    {
      id: 4,
      name: "Rainbow Learning Center",
      rating: 4.6,
      reviews: 75,
      location: "4.5 miles",
      hours: "7:00 AM - 6:00 PM",
      childrenEnrolled: "60 children enrolled",
      price: "$950/month",
      transportAvailable: true,
      image: "🌈",
      tags: ["Verified", "Live CCTV"]
    }
  ];

  res.json({ success: true, data: daycares });
};

const getDaycareById = (req, res) => {
  const { id } = req.params;
  
  const daycare = {
    id: parseInt(id),
    name: "Little Stars Daycare",
    rating: 4.8,
    reviews: 124,
    price: "$1,200/mo",
    careType: "Full-Time Care",
    address: "456 Park Avenue, New York, NY 10022",
    email: "info@littlestarsdaycare.com",
    enrolledInfo: "42/50 enrolled • Ages 6 months - 5 years",
    phone: "+1 (555) 987-6543",
    website: "www.littlestarsdaycare.com",
    hours: "Monday - Friday: 7:00 AM - 6:00 PM",
    about: "Little Stars Daycare provides a safe, nurturing, and stimulating environment for children. Our experienced staff focuses on early childhood development through play-based learning and structured routines. We believe in fostering each child's natural curiosity while ensuring their safety and happiness.\\n\\nEstablished in 2010, we have been serving the community for over 10 years with dedication and excellence. Our modern facility is equipped with state-of-the-art security systems, educational resources, and age-appropriate play areas.",
    coreValues: [
      "Safety and security as top priority",
      "Individualized attention for each child",
      "Promoting social, emotional, and cognitive development",
      "Building strong partnerships with parents"
    ],
    parentFeatures: {
      communication: [
        "Hour-by-hour activity updates via app",
        "Daily meal & sleep reports with photos",
        "Parent-teacher meetings (monthly)",
        "Real-time notifications for important events",
        "Direct messaging with teachers"
      ],
      safety: [
        "GPS-enabled transport with live tracking",
        "Emergency protocols with instant alerts",
        "Secure pick-up/drop-off system",
        "Health monitoring and incident reports",
        "Vaccination tracking system"
      ],
      engagement: [
        "Monthly progress reports with milestones",
        "Event calendar with holidays and celebrations",
        "Parent workshops and seminars",
        "Family day events (quarterly)",
        "Digital portfolio of child's artwork"
      ],
      convenience: [
        "Online payment and billing system",
        "Flexible attendance options (full/part-time/hourly)",
        "Extended hours available upon request",
        "Document upload portal for paperwork",
        "Mobile app for iOS and Android"
      ]
    },
    schedule: {
      daily: [
        { time: "7:00 AM", title: "Arrival & Free Play", desc: "Children arrive and engage in self-directed play" },
        { time: "8:30 AM", title: "Breakfast", desc: "Healthy, balanced breakfast time" },
        { time: "9:00 AM", title: "Circle Time & Learning Activities", desc: "Alphabet, numbers, songs, and stories" },
        { time: "10:30 AM", title: "Outdoor Play", desc: "Fresh air and physical activities" },
        { time: "11:30 AM", title: "Lunch", desc: "Nutritious hot lunch prepared fresh daily" },
        { time: "12:30 PM", title: "Nap Time", desc: "Quiet rest period for all children" },
        { time: "2:30 PM", title: "Snack Time", desc: "Healthy afternoon snacks" },
        { time: "3:00 PM", title: "Art & Craft Activities", desc: "Creative expression and skill development" },
        { time: "4:00 PM", title: "Free Play & Pick-up", desc: "Indoor/outdoor play until parents arrive" }
      ],
      weekly: [
        { day: "Monday", activity: "Music & Movement" },
        { day: "Tuesday", activity: "Science Exploration" },
        { day: "Wednesday", activity: "Library Time & Story Reading" },
        { day: "Thursday", activity: "Cooking (Age-appropriate)" },
        { day: "Friday", activity: "Show & Tell, Special Party (optional)" }
      ]
    },
    staff: [
      { id: 1, initials: "LT", name: "Lisa Thompson", role: "Director", experience: "15 years experience", certs: "Master in Early Childhood" },
      { id: 2, initials: "MS", name: "Maria Santos", role: "Lead Teacher", experience: "10 years experience", certs: "B.A. in Child Development" },
      { id: 3, initials: "JL", name: "Jennifer Lee", role: "Teacher", experience: "7 years experience", certs: "CDA Certification" },
      { id: 4, initials: "SJ", name: "Sarah Johnson", role: "Assistant Teacher", experience: "5 years experience", certs: "CDA Credential" },
      { id: 5, initials: "EC", name: "Emily Chen", role: "Music Instructor", experience: "8 years experience", certs: "Music Education Degree" },
      { id: 6, initials: "DM", name: "David Martinez", role: "Physical Education", experience: "6 years experience", certs: "PE Certification" }
    ],
    admissions: {
      fullTime: { price: "$1,200/mo", desc: "Monday - Friday, Full Day", features: ["All meals included", "Transport service available", "Extended hours option available"] },
      partTime: { price: "$800/mo", desc: "3 days per week", features: ["Flexible days selection", "Meals included on attendance days", "Access to all facilities"] },
      hourly: { price: "$15/hr", desc: "Flexible hourly care", features: ["Minimum 3 hours", "Same-day booking available", "Perfect for emergencies"] }
    },
    reviews: [
      { id: 1, parent: "Sarah Miller", date: "February 15, 2024", rating: 5, text: "Absolutely amazing daycare! The staff is incredibly caring and professional. The live CCTV feature gives me so much peace of mind during the day. My daughter has learned so much and loves going every morning!" },
      { id: 2, parent: "Michael Johnson", date: "February 4, 2024", rating: 5, text: "We've been with Little Stars for 2 years now and couldn't be happier. The daily reports are detailed and helpful, the facilities are spotless, and our son has made great developmental progress." },
      { id: 3, parent: "Emily Rodriguez", date: "January 28, 2024", rating: 5, text: "The transport service is a game-changer! As a working mom, I always know where my child is. The teachers are phenomenal and truly care about each child's individual needs." },
      { id: 4, parent: "David Chen", date: "January 20, 2024", rating: 4, text: "Great daycare with excellent facilities. The only minor issue is occasional delays during peak pick-up times, but overall we're very satisfied with the care our daughter receives." }
    ]
  };

  res.json({ success: true, data: daycare });
};

const getChildReport = (req, res) => {
  const { childId } = req.params;

  const report = {
    childId: parseInt(childId),
    name: "Emma Thompson",
    age: "4 years old",
    date: "Wednesday, February 18, 2026",
    daycare: "Little Stars Daycare",
    overallMood: "Happy & Energetic",
    meals: "3 meals, 90% eaten",
    napTime: "2 hours",
    activitiesCount: 8,
    timeline: [
      { time: "8:00 AM", icon: "🏠", title: "Arrival & Free Play", desc: "Emma arrived happy and immediately joined the block building activity with friends." },
      { time: "9:00 AM", icon: "⭕", title: "Circle Time", desc: "Participated enthusiastically in alphabet learning. Recognized letters A-F!" },
      { time: "9:30 AM", icon: "🥞", title: "Breakfast", desc: "Ate: Oatmeal with berries, banana slices, orange juice. Finished everything!" },
      { time: "10:30 AM", icon: "🏃", title: "Outdoor Play", desc: "Played on the swings and slides. Great social interaction with peers." },
      { time: "11:30 AM", icon: "🍱", title: "Lunch", desc: "Ate: Chicken nuggets, sweet potato fries, mixed vegetables, milk. Good appetite!" },
      { time: "12:30 PM", icon: "💤", title: "Nap Time", desc: "Slept peacefully for 2 hours. Woke up refreshed and happy." },
      { time: "2:30 PM", icon: "🍎", title: "Snack Time", desc: "Ate: Apple slices with peanut butter, crackers, water." },
      { time: "3:00 PM", icon: "🎨", title: "Art & Craft", desc: "Created a beautiful painting using finger paints. Very creative today!" },
      { time: "4:00 PM", icon: "🧩", title: "Free Play", desc: "Playing with dolls and engaging in imaginative role-play." }
    ],
    mealDetails: {
      breakfast: { time: "9:30 AM", note: "Loved the berries!" },
      lunch: { time: "11:30 AM", note: "Left some vegetables." },
      snack: { time: "2:30 PM", note: "Finished everything!" }
    },
    napDetails: {
      duration: "2 hours",
      quality: "Excellent",
      notes: "Fell asleep easily and slept soundly."
    },
    diaperChanges: [
      { time: "9:15 AM", type: "Wet" },
      { time: "10:45 AM", type: "Dirty" },
      { time: "2:00 PM", type: "Wet" },
      { time: "3:30 PM", type: "Wet" }
    ],
    photos: ["building-blocks", "outdoor-play", "art-class", "snack-time"],
    teacherNotes: "Emma had a wonderful day! She was very social and engaged in all activities. Her verbal skills are improving daily. Keep up the great work at home! - Ms. Sarah"
  };

  res.json({ success: true, data: report });
};

const submitApplication = (req, res) => {
  res.json({ success: true, message: "Application submitted successfully" });
};

const processPayment = (req, res) => {
  res.json({ success: true, message: "Payment processed successfully", transactionId: "TXN" + Math.floor(Math.random() * 1000000) });
};

// Daycare Portal Features
const ensureDaycare = async (req, res, next) => {
  try {
    const daycare = await DaycareModel.getDaycareByOwnerId(req.user.id)
    if (!daycare) {
      return res.status(404).json({ message: 'Daycare profile not found' })
    }
    req.daycare = daycare
    next()
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const stats = await DaycareModel.getDashboardStats(req.daycare.id)
    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message })
  }
}

const getProfile = async (req, res) => {
  res.json(req.daycare)
}

const updateProfile = async (req, res) => {
  try {
    await DaycareModel.updateDaycare(req.daycare.id, req.body)
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message })
  }
}

const createProfile = async (req, res) => {
  try {
    const existing = await DaycareModel.getDaycareByOwnerId(req.user.id)
    if (existing) return res.status(400).json({ message: 'Daycare already exists for this user' })
    const id = await DaycareModel.createDaycare(req.user.id, req.body)
    res.status(201).json({ id, message: 'Daycare created' })
  } catch (err) {
    res.status(500).json({ message: 'Error creating daycare', error: err.message })
  }
}

const getPackages = async (req, res) => {
  try {
    const packages = await DaycareModel.getPackages(req.daycare.id)
    res.json(packages)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err.message })
  }
}

const createPackage = async (req, res) => {
  try {
    await DaycareModel.createPackage(req.daycare.id, req.body)
    res.status(201).json({ message: 'Package created' })
  } catch (err) {
    res.status(500).json({ message: 'Error creating package', error: err.message })
  }
}

const getApplications = async (req, res) => {
  try {
    const apps = await DaycareModel.getApplications(req.daycare.id)
    res.json(apps)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message })
  }
}

const updateApplication = async (req, res) => {
  try {
    await DaycareModel.updateApplicationStatus(req.params.id, req.body.status)
    res.json({ message: 'Application updated' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating application', error: err.message })
  }
}

const getChildren = async (req, res) => {
  try {
    const children = await DaycareModel.getChildren(req.daycare.id)
    res.json(children)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching children', error: err.message })
  }
}

const getStaff = async (req, res) => {
  try {
    const staff = await DaycareModel.getStaff(req.daycare.id)
    res.json(staff)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff', error: err.message })
  }
}

const addStaff = async (req, res) => {
  try {
    await DaycareModel.addStaff(req.daycare.id, req.body)
    res.status(201).json({ message: 'Staff added' })
  } catch (err) {
    res.status(500).json({ message: 'Error adding staff', error: err.message })
  }
}

const updateStaff = async (req, res) => {
  try {
    await DaycareModel.updateStaff(req.daycare.id, req.params.staffId, req.body)
    res.json({ message: 'Staff updated' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating staff', error: err.message })
  }
}

const deleteStaff = async (req, res) => {
  try {
    await DaycareModel.deleteStaff(req.daycare.id, req.params.staffId)
    res.json({ message: 'Staff deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting staff', error: err.message })
  }
}

const getTransport = async (req, res) => {
  try {
    const transports = await DaycareModel.getTransport(req.daycare.id)
    res.json(transports)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transport', error: err.message })
  }
}

const addTransport = async (req, res) => {
  try {
    await DaycareModel.addTransport(req.daycare.id, req.body)
    res.status(201).json({ message: 'Transport added' })
  } catch (err) {
    res.status(500).json({ message: 'Error adding transport', error: err.message })
  }
}

const getDailyReports = async (req, res) => {
  try {
    const reports = await DaycareModel.getDailyReports(req.daycare.id)
    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message })
  }
}

const addDailyReport = async (req, res) => {
  try {
    await DaycareModel.addDailyReport(req.daycare.id, req.body)
    res.status(201).json({ message: 'Report added' })
  } catch (err) {
    res.status(500).json({ message: 'Error adding report', error: err.message })
  }
}

module.exports = {
  getDaycares,
  getDaycareById,
  getChildReport,
  submitApplication,
  processPayment,
  ensureDaycare,
  getDashboardStats,
  getProfile,
  updateProfile,
  createProfile,
  getPackages,
  createPackage,
  getApplications,
  updateApplication,
  getChildren,
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getTransport,
  addTransport,
  getDailyReports,
  addDailyReport
};
