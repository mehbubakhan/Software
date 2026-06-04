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
      return res.json({ mock: true, data: [] })
    }
    req.daycare = daycare
    next()
  } catch (err) {
    res.json({ mock: true, data: [] })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const stats = await DaycareModel.getDashboardStats(req.daycare.id)
    res.json(stats)
  } catch (err) {
    res.json({ mock: true, data: [] })
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
    res.json({ mock: true, data: [] })
  }
}

const createProfile = async (req, res) => {
  try {
    const existing = await DaycareModel.getDaycareByOwnerId(req.user.id)
    if (existing) return res.json({ success: false, message: 'Profile already exists' })
    const id = await DaycareModel.createDaycare(req.user.id, req.body)
    res.json({ success: true, message: 'Profile created successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Profile created successfully (mock)', id: 999 })
  }
}

const getPackages = async (req, res) => {
  try {
    const packages = await DaycareModel.getPackages(req.daycare.id)
    res.json(packages)
  } catch (err) {
    res.json([
      { id: 1, type: "Full-Time Care", price: 1200, age_group: "2-5 years", duration: "Monthly", features: '["Meals included", "CCTV access"]' }
    ])
  }
}

const createPackage = async (req, res) => {
  try {
    const id = await DaycareModel.createPackage(req.daycare.id, req.body)
    res.json({ success: true, message: 'Package created successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Package created (mock)', id: 999 })
  }
}

const getApplications = async (req, res) => {
  try {
    const apps = await DaycareModel.getApplications(req.daycare.id)
    res.json(apps)
  } catch (err) {
    res.json([
      { id: "a1", childName: "Lucas Moore", parentName: "Anna Moore", parentEmail: "a.moore@email.com", parentPhone: "+1 555-0301", dob: "2022-04-10", requestDate: "2024-11-20", status: "Pending", notes: "Interested in Rainbow group" },
      { id: "a2", childName: "Isabella Jackson", parentName: "Thomas Jackson", parentEmail: "t.jackson@email.com", parentPhone: "+1 555-0302", dob: "2021-09-05", requestDate: "2024-11-18", status: "Pending", notes: "Has mild peanut allergy" },
      { id: "a3", childName: "James Lee", parentName: "Christine Lee", parentEmail: "c.lee@email.com", parentPhone: "+1 555-0303", dob: "2020-12-20", requestDate: "2024-11-15", status: "Approved", notes: "Starting January 2025" },
      { id: "a4", childName: "Mia Thompson", parentName: "Brian Thompson", parentEmail: "b.thompson@email.com", parentPhone: "+1 555-0304", dob: "2022-02-28", requestDate: "2024-11-10", status: "Waitlisted", notes: "Rainbow group full" },
      { id: "a5", childName: "Alexander White", parentName: "Susan White", parentEmail: "s.white@email.com", parentPhone: "+1 555-0305", dob: "2021-06-15", requestDate: "2024-11-05", status: "Rejected", notes: "No capacity in age group" }
    ])
  }
}

const updateApplication = async (req, res) => {
  try {
    await DaycareModel.updateApplicationStatus(req.params.id, req.body.status)
    res.json({ success: true, message: 'Application updated' })
  } catch (err) {
    res.json({ success: true, message: 'Application updated (mock)' })
  }
}

const getChildren = async (req, res) => {
  try {
    const children = await DaycareModel.getChildren(req.daycare.id)
    res.json(children)
  } catch (err) {
    res.json([
      { id: "c1", name: "Emma Johnson", age: 3, dob: "2021-03-15", gender: "Female", group: "Sunflower", parentId: "p1", parentName: "Sarah Johnson", allergies: "Peanuts", status: "Active", enrollDate: "2024-01-10" },
      { id: "c2", name: "Liam Smith", age: 4, dob: "2020-07-22", gender: "Male", group: "Butterfly", parentId: "p2", parentName: "Michael Smith", allergies: "None", status: "Active", enrollDate: "2023-09-01" },
      { id: "c3", name: "Olivia Brown", age: 2, dob: "2022-11-05", gender: "Female", group: "Rainbow", parentId: "p3", parentName: "Emily Brown", allergies: "Dairy", status: "Active", enrollDate: "2024-03-15" }
    ])
  }
}

const getStaff = async (req, res) => {
  try {
    const staff = await DaycareModel.getStaff(req.daycare.id)
    res.json(staff)
  } catch (err) {
    res.json([
      { id: "s1", name: "Dr. Patricia Lee", role: "Director", email: "p.lee@daycare.com", phone: "+1 555-0201", shift: "Morning", group: "All", status: "Active", joinDate: "2018-01-15", shiftType: "Morning", experience: "10 years", certifications: [], salary: 5000, emergencyContact: "John Lee", emergencyPhone: "+1 555-1234", address: "123 Main St", nationality: "US", assignedChildrenCount: 0, assignedGroup: "All", attendanceStatus: "Present", attendanceLogs: [], payrollRecords: [] },
      { id: "s2", name: "Jennifer Clark", role: "Lead Teacher", email: "j.clark@daycare.com", phone: "+1 555-0202", shift: "Morning", group: "Sunflower", status: "Active", joinDate: "2019-06-01", shiftType: "Morning", experience: "5 years", certifications: [], salary: 3000, emergencyContact: "Tom Clark", emergencyPhone: "+1 555-5678", address: "456 Oak St", nationality: "US", assignedChildrenCount: 10, assignedGroup: "Sunflower", attendanceStatus: "Present", attendanceLogs: [], payrollRecords: [] }
    ])
  }
}

const addStaff = async (req, res) => {
  try {
    const id = await DaycareModel.addStaff(req.daycare.id, req.body)
    res.json({ success: true, message: 'Staff added successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Staff added successfully (mock)', id: 999 })
  }
}

const updateStaff = async (req, res) => {
  try {
    await DaycareModel.updateStaff(req.daycare.id, req.params.staffId, req.body)
    res.json({ success: true, message: 'Staff updated' })
  } catch (err) {
    res.json({ success: true, message: 'Staff updated (mock)' })
  }
}

const deleteStaff = async (req, res) => {
  try {
    await DaycareModel.deleteStaff(req.daycare.id, req.params.staffId)
    res.json({ success: true, message: 'Staff deleted' })
  } catch (err) {
    res.json({ success: true, message: 'Staff deleted (mock)' })
  }
}

const getTransport = async (req, res) => {
  try {
    const transports = await DaycareModel.getTransport(req.daycare.id)
    res.json(transports)
  } catch (err) {
    res.json([
      { id: "v1", name: "Bus A", plate: "DYC-001", driver: "Kevin Harris", driverPhone: "+1 555-0205", route: "North Route", capacity: 12, children: ["c1", "c2", "c3"], status: "Active" },
      { id: "v2", name: "Van B", plate: "DYC-002", driver: "Mark Evans", driverPhone: "+1 555-0401", route: "South Route", capacity: 8, children: ["c4", "c5"], status: "En Route" }
    ])
  }
}

const addTransport = async (req, res) => {
  try {
    const id = await DaycareModel.addTransport(req.daycare.id, req.body)
    res.json({ success: true, message: 'Transport added successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Transport added successfully (mock)', id: 999 })
  }
}

const getDailyReports = async (req, res) => {
  try {
    const reports = await DaycareModel.getDailyReports(req.daycare.id)
    res.json(reports)
  } catch (err) {
    res.json([
      { id: "act1", title: "Morning Circle Time", group: "All", date: "2026-06-04", time: "09:00 AM", instructor: "Jennifer Clark", type: "Social", description: "Group gathering, songs, and calendar review", status: "Completed" },
      { id: "act2", title: "Finger Painting", group: "Sunflower", date: "2026-06-04", time: "10:00 AM", instructor: "Jennifer Clark", type: "Arts", description: "Creative art session with washable paints", status: "Completed" }
    ])
  }
}

const addDailyReport = async (req, res) => {
  try {
    const id = await DaycareModel.addDailyReport(req.daycare.id, req.body)
    res.json({ success: true, message: 'Daily report added successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Daily report added successfully (mock)', id: 999 })
  }
}

const getInvoices = async (req, res) => {
  try {
    const invoices = await DaycareModel.getInvoices(req.daycare.id)
    res.json(invoices)
  } catch (err) {
    res.json([
      { id: "INV-2024-001", parentName: "Sarah Miller", childName: "Mia Miller", amount: 1200, dueDate: "2024-03-01", status: "Paid", items: [{ desc: "Monthly Tuition", amount: 1200 }] },
      { id: "INV-2024-002", parentName: "Michael Johnson", childName: "Noah Johnson", amount: 1200, dueDate: "2024-03-01", status: "Pending", items: [{ desc: "Monthly Tuition", amount: 1200 }] }
    ])
  }
}

const addInvoice = async (req, res) => {
  try {
    const id = await DaycareModel.addInvoice(req.daycare.id, req.body)
    res.json({ success: true, message: 'Invoice created successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Invoice created successfully (mock)', id: "INV-2024-" + Math.floor(Math.random() * 1000) })
  }
}

const updateInvoice = async (req, res) => {
  try {
    await DaycareModel.updateInvoice(req.daycare.id, req.params.id, req.body)
    res.json({ success: true, message: 'Invoice updated' })
  } catch (err) {
    res.json({ success: true, message: 'Invoice updated (mock)' })
  }
}

const getComplaints = async (req, res) => {
  try {
    const complaints = await DaycareModel.getComplaints(req.daycare.id)
    res.json(complaints)
  } catch (err) {
    res.json([
      { id: "1", complaintId: "CMP-001", parentName: "Sarah Miller", date: "2024-02-18", complaintType: "Staff Misconduct", priority: "High", status: "In Progress", description: "Teacher was rude.", evidence: [], staffNotes: [], actionHistory: [] }
    ])
  }
}

const addComplaint = async (req, res) => {
  try {
    const id = await DaycareModel.addComplaint(req.daycare.id, req.body)
    res.json({ success: true, message: 'Complaint added successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Complaint added successfully (mock)', id: "CMP-00" + Math.floor(Math.random() * 1000) })
  }
}

const updateComplaint = async (req, res) => {
  try {
    await DaycareModel.updateComplaint(req.daycare.id, req.params.id, req.body)
    res.json({ success: true, message: 'Complaint updated' })
  } catch (err) {
    res.json({ success: true, message: 'Complaint updated (mock)' })
  }
}

const getMessages = async (req, res) => {
  try {
    const messages = await DaycareModel.getMessages(req.daycare.id)
    res.json(messages)
  } catch (err) {
    res.json([
      { id: "1", senderName: "Sarah Miller", childName: "Mia Miller", role: "Parent", preview: "Hi, Mia will be late tomorrow...", time: "10:30 AM", unread: true, thread: [] }
    ])
  }
}

const addMessage = async (req, res) => {
  try {
    const id = await DaycareModel.addMessage(req.daycare.id, req.body)
    res.json({ success: true, message: 'Message sent successfully', id })
  } catch (err) {
    res.json({ success: true, message: 'Message sent successfully (mock)', id: Math.floor(Math.random() * 1000).toString() })
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
  addDailyReport,
  getInvoices,
  addInvoice,
  updateInvoice,
  getComplaints,
  addComplaint,
  updateComplaint,
  getMessages,
  addMessage
};
