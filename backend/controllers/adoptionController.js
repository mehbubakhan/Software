const children = [
  {
    id: 1,
    name: 'Emma',
    age: '3 years old',
    gender: 'Female',
    matchStatus: 'Excellent',
    educationLevel: 'Attending preschool activities',
    currentLocation: 'Sunshine Children\'s Home',
    availableSince: 'January 15, 2024',
    languages: ['English'],
    description: 'Cheerful, curious, and loves making friends. Emma has a bright smile and enjoys role-playing.',
    interests: ['Drawing', 'Playing with dolls', 'Singing'],
    medicalInfo: {
      healthCondition: 'Excellent',
      medicalHistory: 'All vaccinations up to date. No major health issues.',
      specialNeeds: 'None'
    },
    image: 'E'
  },
  {
    id: 2,
    name: 'Oliver',
    age: '5 years old',
    gender: 'Male',
    matchStatus: 'Good',
    educationLevel: 'Kindergarten',
    currentLocation: 'Sunshine Children\'s Home',
    availableSince: 'October 28, 2023',
    languages: ['English', 'Spanish'],
    description: 'Energetic and playful. Oliver is very affectionate and loves nature and animals.',
    interests: ['Building blocks', 'Outdoor games', 'Animals'],
    medicalInfo: {
      healthCondition: 'Good',
      medicalHistory: 'Asthma (mild). Requires inhaler during strenuous exercise.',
      specialNeeds: 'Requires occasional asthma management.'
    },
    image: 'O'
  },
  {
    id: 3,
    name: 'Sophia',
    age: '4 years old',
    gender: 'Female',
    matchStatus: 'Excellent',
    educationLevel: 'Preschool',
    currentLocation: 'Little Angels Foundation',
    availableSince: 'February 10, 2024',
    languages: ['English'],
    description: 'Creative and gentle. Sophia is thoughtful and enjoys quiet activities as well as dancing.',
    interests: ['Reading', 'Reading picture books', 'Dancing'],
    medicalInfo: {
      healthCondition: 'Excellent',
      medicalHistory: 'Fully vaccinated. Healthy.',
      specialNeeds: 'None'
    },
    image: 'S'
  },
  {
    id: 4,
    name: 'Liam',
    age: '6 years old',
    gender: 'Male',
    matchStatus: 'Good',
    educationLevel: '1st Grade',
    currentLocation: 'Little Angels Foundation',
    availableSince: 'December 1, 2023',
    languages: ['English'],
    description: 'Intelligent and curious. Liam loves learning new things and asking questions.',
    interests: ['Soccer', 'Puzzles', 'Science experiments'],
    medicalInfo: {
      healthCondition: 'Good',
      medicalHistory: 'Allergic to peanuts.',
      specialNeeds: 'Strict nut-free diet.'
    },
    image: 'L'
  },
  {
    id: 5,
    name: 'Mia',
    age: '2 years old',
    gender: 'Female',
    matchStatus: 'Excellent',
    educationLevel: 'Toddler program',
    currentLocation: 'Happy Hearts Orphanage',
    availableSince: 'March 5, 2024',
    languages: ['English'],
    description: 'Sweet and affectionate. Mia loves hugs and responds well to music and rhythm.',
    interests: ['Music', 'Soft toys', 'Sensory games'],
    medicalInfo: {
      healthCondition: 'Excellent',
      medicalHistory: 'Healthy and reaching all developmental milestones.',
      specialNeeds: 'None'
    },
    image: 'M'
  },
  {
    id: 6,
    name: 'Noah',
    age: '7 years old',
    gender: 'Male',
    matchStatus: 'Good',
    educationLevel: '2nd Grade',
    currentLocation: 'Happy Hearts Orphanage',
    availableSince: 'September 15, 2023',
    languages: ['English'],
    description: 'Responsible and kind. Noah often helps younger children and shows leadership qualities.',
    interests: ['Reading', 'Drawing', 'Basketball'],
    medicalInfo: {
      healthCondition: 'Good',
      medicalHistory: 'Wears glasses for reading.',
      specialNeeds: 'Requires corrective lenses.'
    },
    image: 'N'
  }
];

const orphanages = [
  {
    id: 1,
    name: 'Sunshine Children\'s Home',
    address: '123 Hope Street, Downtown',
    description: 'A warm and caring environment dedicated to providing love, education, and support to children in need.',
    rating: 4.8,
    childrenAdopted: 45,
    established: 2010,
    license: 'LIC-2010-001',
    facilities: ['Medical Care', 'Educational Programs', 'Recreation Center', 'Counseling Services', 'Nutrition Programs'],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@sunshinechildrenshome.org'
    }
  },
  {
    id: 2,
    name: 'Little Angels Foundation',
    address: '456 Care Avenue, Midtown',
    description: 'Providing a nurturing home where every child is valued, supported, and given opportunities to thrive.',
    rating: 4.9,
    childrenAdopted: 62,
    established: 2005,
    license: 'LIC-2005-012',
    facilities: ['24/7 Medical Support', 'Modern Classrooms', 'Sports Facilities', 'Art & Music Programs', 'Library'],
    contact: {
      phone: '+1 (555) 234-5678',
      email: 'contact@littleangels.org'
    }
  },
  {
    id: 3,
    name: 'Happy Hearts Orphanage',
    address: '789 Love Lane, Uptown',
    description: 'Creating a family-like atmosphere where children can grow, learn, and prepare for a brighter future.',
    rating: 4.7,
    childrenAdopted: 38,
    established: 2012,
    license: 'LIC-2012-025',
    facilities: ['Health Clinic', 'Computer Lab', 'Playground', 'Vocational Training', 'Psychological Support'],
    contact: {
      phone: '+1 (555) 345-6789',
      email: 'admin@happyhearts.org'
    }
  }
];

const applications = [
  {
    id: 'APP-5928',
    childName: 'Emma',
    childAge: '3 years old',
    childGender: 'Female',
    dateApplied: '02/25/2024',
    lastUpdated: '03/01/2024',
    status: 'Background check in progress',
    timeline: [
      { stage: 'Application Submitted', date: '02/25/2024', completed: true },
      { stage: 'Initial Review', date: '02/28/2024', completed: true },
      { stage: 'Interview Scheduled', date: 'Pending', completed: false },
      { stage: 'Final Approval', date: 'Pending', completed: false }
    ],
    documents: [
      { name: 'Government Issued ID', uploaded: true },
      { name: 'Proof of Residence', uploaded: true },
      { name: 'Employment Verification Letter', uploaded: true },
      { name: 'Income Tax Returns (Last 2 years)', uploaded: true },
      { name: 'Bank Statements (Last 6 months)', uploaded: true },
      { name: 'Marriage Certificate (If applicable)', uploaded: false },
      { name: 'Medical Clearance Certificate', uploaded: false },
      { name: 'Police Clearance Certificate', uploaded: false },
      { name: 'Character References (2-3 letters)', uploaded: false },
      { name: 'Home Study Report (Provided by agency after visit)', uploaded: false }
    ]
  },
  {
    id: 'APP-5929',
    childName: 'Oliver',
    childAge: '5 years old',
    childGender: 'Male',
    dateApplied: '02/10/2024',
    lastUpdated: '03/10/2024',
    status: 'Pending Home Study Review',
    timeline: [
      { stage: 'Application Submitted', date: '02/10/2024', completed: true },
      { stage: 'Initial Review', date: '02/15/2024', completed: true },
      { stage: 'Interview Scheduled', date: '03/01/2024', completed: true },
      { stage: 'Final Approval', date: 'Pending', completed: false }
    ],
    documents: [
       { name: 'Government Issued ID', uploaded: true },
       { name: 'Proof of Residence', uploaded: true },
       { name: 'Employment Verification Letter', uploaded: true },
       { name: 'Income Tax Returns (Last 2 years)', uploaded: true },
       { name: 'Bank Statements (Last 6 months)', uploaded: true },
       { name: 'Marriage Certificate (If applicable)', uploaded: true },
       { name: 'Medical Clearance Certificate', uploaded: true },
       { name: 'Police Clearance Certificate', uploaded: true },
       { name: 'Character References (2-3 letters)', uploaded: true },
       { name: 'Home Study Report (Provided by agency after visit)', uploaded: false }
    ]
  }
];

exports.getChildren = (req, res) => {
  res.json({ success: true, data: children });
};

exports.getChildById = (req, res) => {
  const child = children.find(c => c.id === parseInt(req.params.id));
  if (child) {
    res.json({ success: true, data: child });
  } else {
    res.status(404).json({ success: false, message: 'Child not found' });
  }
};

exports.getOrphanages = (req, res) => {
  res.json({ success: true, data: orphanages });
};

exports.getOrphanageById = (req, res) => {
  const orphanage = orphanages.find(o => o.id === parseInt(req.params.id));
  if (orphanage) {
    const orphanageChildren = children.filter(c => c.currentLocation === orphanage.name);
    res.json({ success: true, data: { ...orphanage, children: orphanageChildren } });
  } else {
    res.status(404).json({ success: false, message: 'Orphanage not found' });
  }
};

exports.getApplications = (req, res) => {
  res.json({ success: true, data: applications });
};
