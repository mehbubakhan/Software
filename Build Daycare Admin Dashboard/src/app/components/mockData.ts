import type { Child, Parent, Staff, Admission, Vehicle, Activity, HealthRecord, Invoice, Complaint, Message, Notification } from "./types";

export const mockChildren: Child[] = [
  { id: "c1", name: "Emma Johnson", age: 3, dob: "2021-03-15", gender: "Female", group: "Sunflower", parentId: "p1", parentName: "Sarah Johnson", allergies: "Peanuts", status: "Active", enrollDate: "2024-01-10" },
  { id: "c2", name: "Liam Smith", age: 4, dob: "2020-07-22", gender: "Male", group: "Butterfly", parentId: "p2", parentName: "Michael Smith", allergies: "None", status: "Active", enrollDate: "2023-09-01" },
  { id: "c3", name: "Olivia Brown", age: 2, dob: "2022-11-05", gender: "Female", group: "Rainbow", parentId: "p3", parentName: "Emily Brown", allergies: "Dairy", status: "Active", enrollDate: "2024-03-15" },
  { id: "c4", name: "Noah Davis", age: 5, dob: "2019-05-18", gender: "Male", group: "Star", parentId: "p4", parentName: "Robert Davis", allergies: "None", status: "Active", enrollDate: "2022-09-01" },
  { id: "c5", name: "Ava Wilson", age: 3, dob: "2021-08-30", gender: "Female", group: "Sunflower", parentId: "p5", parentName: "Jessica Wilson", allergies: "Gluten", status: "Active", enrollDate: "2023-11-01" },
  { id: "c6", name: "Ethan Martinez", age: 4, dob: "2020-02-14", gender: "Male", group: "Butterfly", parentId: "p6", parentName: "Carlos Martinez", allergies: "None", status: "Inactive", enrollDate: "2023-01-15" },
  { id: "c7", name: "Sophia Taylor", age: 2, dob: "2022-06-10", gender: "Female", group: "Rainbow", parentId: "p7", parentName: "Laura Taylor", allergies: "Eggs", status: "Active", enrollDate: "2024-06-01" },
  { id: "c8", name: "Mason Anderson", age: 5, dob: "2019-12-25", gender: "Male", group: "Star", parentId: "p8", parentName: "David Anderson", allergies: "None", status: "Active", enrollDate: "2022-01-10" },
];

export const mockParents: Parent[] = [
  { id: "p1", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 555-0101", address: "123 Maple St, Springfield", children: ["c1"], emergencyContact: "+1 555-0199", status: "Active" },
  { id: "p2", name: "Michael Smith", email: "m.smith@email.com", phone: "+1 555-0102", address: "456 Oak Ave, Springfield", children: ["c2"], emergencyContact: "+1 555-0198", status: "Active" },
  { id: "p3", name: "Emily Brown", email: "emily.b@email.com", phone: "+1 555-0103", address: "789 Pine Rd, Springfield", children: ["c3"], emergencyContact: "+1 555-0197", status: "Active" },
  { id: "p4", name: "Robert Davis", email: "r.davis@email.com", phone: "+1 555-0104", address: "321 Elm St, Springfield", children: ["c4"], emergencyContact: "+1 555-0196", status: "Active" },
  { id: "p5", name: "Jessica Wilson", email: "j.wilson@email.com", phone: "+1 555-0105", address: "654 Cedar Ln, Springfield", children: ["c5"], emergencyContact: "+1 555-0195", status: "Active" },
  { id: "p6", name: "Carlos Martinez", email: "c.martinez@email.com", phone: "+1 555-0106", address: "987 Birch Dr, Springfield", children: ["c6"], emergencyContact: "+1 555-0194", status: "Inactive" },
  { id: "p7", name: "Laura Taylor", email: "l.taylor@email.com", phone: "+1 555-0107", address: "147 Willow Way, Springfield", children: ["c7"], emergencyContact: "+1 555-0193", status: "Active" },
  { id: "p8", name: "David Anderson", email: "d.anderson@email.com", phone: "+1 555-0108", address: "258 Spruce Ct, Springfield", children: ["c8"], emergencyContact: "+1 555-0192", status: "Active" },
];

export const mockStaff: Staff[] = [
  { id: "s1", name: "Dr. Patricia Lee", role: "Director", email: "p.lee@daycare.com", phone: "+1 555-0201", shift: "Morning", group: "All", status: "Active", joinDate: "2018-01-15" },
  { id: "s2", name: "Jennifer Clark", role: "Lead Teacher", email: "j.clark@daycare.com", phone: "+1 555-0202", shift: "Morning", group: "Sunflower", status: "Active", joinDate: "2019-06-01" },
  { id: "s3", name: "Marcus Thompson", role: "Assistant Teacher", email: "m.thompson@daycare.com", phone: "+1 555-0203", shift: "Afternoon", group: "Butterfly", status: "Active", joinDate: "2020-09-01" },
  { id: "s4", name: "Amanda White", role: "Nanny", email: "a.white@daycare.com", phone: "+1 555-0204", shift: "Full Day", group: "Rainbow", status: "Active", joinDate: "2021-03-15" },
  { id: "s5", name: "Kevin Harris", role: "Driver", email: "k.harris@daycare.com", phone: "+1 555-0205", shift: "Morning", group: "Transport", status: "Active", joinDate: "2020-01-10" },
  { id: "s6", name: "Rachel Green", role: "Nurse", email: "r.green@daycare.com", phone: "+1 555-0206", shift: "Full Day", group: "Health", status: "On Leave", joinDate: "2019-11-01" },
  { id: "s7", name: "Tom Robinson", role: "Assistant Teacher", email: "t.robinson@daycare.com", phone: "+1 555-0207", shift: "Morning", group: "Star", status: "Active", joinDate: "2022-01-15" },
];

export const mockAdmissions: Admission[] = [
  { id: "a1", childName: "Lucas Moore", parentName: "Anna Moore", parentEmail: "a.moore@email.com", parentPhone: "+1 555-0301", dob: "2022-04-10", requestDate: "2024-11-20", status: "Pending", notes: "Interested in Rainbow group" },
  { id: "a2", childName: "Isabella Jackson", parentName: "Thomas Jackson", parentEmail: "t.jackson@email.com", parentPhone: "+1 555-0302", dob: "2021-09-05", requestDate: "2024-11-18", status: "Pending", notes: "Has mild peanut allergy" },
  { id: "a3", childName: "James Lee", parentName: "Christine Lee", parentEmail: "c.lee@email.com", parentPhone: "+1 555-0303", dob: "2020-12-20", requestDate: "2024-11-15", status: "Approved", notes: "Starting January 2025" },
  { id: "a4", childName: "Mia Thompson", parentName: "Brian Thompson", parentEmail: "b.thompson@email.com", parentPhone: "+1 555-0304", dob: "2022-02-28", requestDate: "2024-11-10", status: "Waitlisted", notes: "Rainbow group full" },
  { id: "a5", childName: "Alexander White", parentName: "Susan White", parentEmail: "s.white@email.com", parentPhone: "+1 555-0305", dob: "2021-06-15", requestDate: "2024-11-05", status: "Rejected", notes: "No capacity in age group" },
];

export const mockVehicles: Vehicle[] = [
  { id: "v1", name: "Bus A", plate: "DYC-001", driver: "Kevin Harris", driverPhone: "+1 555-0205", route: "North Route", capacity: 12, children: ["c1", "c2", "c3"], status: "Active" },
  { id: "v2", name: "Van B", plate: "DYC-002", driver: "Mark Evans", driverPhone: "+1 555-0401", route: "South Route", capacity: 8, children: ["c4", "c5"], status: "En Route" },
  { id: "v3", name: "Bus C", plate: "DYC-003", driver: "Linda Foster", driverPhone: "+1 555-0402", route: "East Route", capacity: 12, children: ["c6", "c7", "c8"], status: "Active" },
];

export const mockActivities: Activity[] = [
  { id: "act1", title: "Morning Circle Time", group: "All", date: "2026-06-04", time: "09:00 AM", instructor: "Jennifer Clark", type: "Social", description: "Group gathering, songs, and calendar review", status: "Completed" },
  { id: "act2", title: "Finger Painting", group: "Sunflower", date: "2026-06-04", time: "10:00 AM", instructor: "Jennifer Clark", type: "Arts", description: "Creative art session with washable paints", status: "Completed" },
  { id: "act3", title: "Outdoor Play", group: "All", date: "2026-06-04", time: "11:00 AM", instructor: "Marcus Thompson", type: "Physical", description: "Supervised outdoor play and exercise", status: "In Progress" },
  { id: "act4", title: "Lunch Break", group: "All", date: "2026-06-04", time: "12:00 PM", instructor: "Amanda White", type: "Meal", description: "Nutritious lunch and social eating", status: "Scheduled" },
  { id: "act5", title: "Story Time", group: "Rainbow", date: "2026-06-04", time: "02:00 PM", instructor: "Amanda White", type: "Educational", description: "Interactive reading and comprehension", status: "Scheduled" },
  { id: "act6", title: "Music & Movement", group: "Butterfly", date: "2026-06-04", time: "03:00 PM", instructor: "Jennifer Clark", type: "Arts", description: "Songs, rhythm, and movement activities", status: "Scheduled" },
];

export const mockHealthRecords: HealthRecord[] = [
  { id: "h1", childId: "c1", childName: "Emma Johnson", type: "Medication", date: "2026-06-04", description: "Antihistamine administered for mild allergic reaction (peanut trace)", nurse: "Rachel Green", status: "Resolved" },
  { id: "h2", childId: "c3", childName: "Olivia Brown", type: "Incident", date: "2026-06-03", description: "Minor fall during outdoor play, small bruise on knee, parent notified", nurse: "Rachel Green", status: "Resolved" },
  { id: "h3", childId: "c5", childName: "Ava Wilson", type: "Allergy", date: "2026-06-01", description: "Gluten sensitivity confirmed, updated meal plan", nurse: "Rachel Green", status: "Active" },
  { id: "h4", childId: "c2", childName: "Liam Smith", type: "Checkup", date: "2026-05-28", description: "Routine monthly health checkup — all good", nurse: "Rachel Green", status: "Resolved" },
  { id: "h5", childId: "c8", childName: "Mason Anderson", type: "Medication", date: "2026-06-04", description: "Cough syrup administered per parent prescription — 5ml at 10am", nurse: "Rachel Green", status: "Active" },
];

export const mockInvoices: Invoice[] = [
  { id: "inv1", parentName: "Sarah Johnson", childName: "Emma Johnson", amount: 850, dueDate: "2026-06-15", issueDate: "2026-06-01", status: "Pending", description: "June 2026 Monthly Tuition" },
  { id: "inv2", parentName: "Michael Smith", childName: "Liam Smith", amount: 850, dueDate: "2026-06-15", issueDate: "2026-06-01", status: "Paid", description: "June 2026 Monthly Tuition" },
  { id: "inv3", parentName: "Emily Brown", childName: "Olivia Brown", amount: 750, dueDate: "2026-06-15", issueDate: "2026-06-01", status: "Pending", description: "June 2026 Monthly Tuition" },
  { id: "inv4", parentName: "Robert Davis", childName: "Noah Davis", amount: 850, dueDate: "2026-05-15", issueDate: "2026-05-01", status: "Overdue", description: "May 2026 Monthly Tuition" },
  { id: "inv5", parentName: "Jessica Wilson", childName: "Ava Wilson", amount: 900, dueDate: "2026-06-15", issueDate: "2026-06-01", status: "Paid", description: "June 2026 Monthly Tuition + Activity Fee" },
  { id: "inv6", parentName: "Laura Taylor", childName: "Sophia Taylor", amount: 750, dueDate: "2026-06-15", issueDate: "2026-06-01", status: "Pending", description: "June 2026 Monthly Tuition" },
];

export const mockComplaints: Complaint[] = [
  { id: "comp1", parentName: "Sarah Johnson", subject: "Allergic Reaction Handling", description: "Concerned about the response time when Emma had her allergic reaction yesterday.", date: "2026-06-03", status: "In Progress", priority: "High", assignedTo: "Dr. Patricia Lee" },
  { id: "comp2", parentName: "Michael Smith", subject: "Bus Delay", description: "The school bus was 30 minutes late on Tuesday without any notification.", date: "2026-06-02", status: "Resolved", priority: "Medium", assignedTo: "Kevin Harris" },
  { id: "comp3", parentName: "Emily Brown", subject: "Meal Quality", description: "Olivia mentioned the food was cold twice this week. Please look into this.", date: "2026-06-01", status: "Open", priority: "Low", assignedTo: "Jennifer Clark" },
  { id: "comp4", parentName: "Robert Davis", subject: "Staff Behavior", description: "Noticed a staff member speaking harshly to children during pickup yesterday.", date: "2026-05-30", status: "In Progress", priority: "High", assignedTo: "Dr. Patricia Lee" },
];

export const mockMessages: Message[] = [
  {
    id: "m1", from: "Sarah Johnson", avatar: "SJ", role: "Parent", lastMessage: "Is Emma eating well today?", time: "10:32 AM", unread: 2,
    messages: [
      { id: "msg1", sender: "them", text: "Good morning! How is Emma doing today?", time: "9:00 AM" },
      { id: "msg2", sender: "me", text: "Emma is doing great! She enjoyed her painting session.", time: "9:15 AM" },
      { id: "msg3", sender: "them", text: "That's wonderful to hear! Is Emma eating well today?", time: "10:32 AM" },
    ]
  },
  {
    id: "m2", from: "Michael Smith", avatar: "MS", role: "Parent", lastMessage: "Thanks for the update!", time: "Yesterday", unread: 0,
    messages: [
      { id: "msg4", sender: "them", text: "Hi, just checking on Liam's progress in reading.", time: "Yesterday 3:00 PM" },
      { id: "msg5", sender: "me", text: "Liam is making excellent progress! He can now recognize all the letters.", time: "Yesterday 3:30 PM" },
      { id: "msg6", sender: "them", text: "Thanks for the update!", time: "Yesterday 3:45 PM" },
    ]
  },
  {
    id: "m3", from: "Jennifer Clark", avatar: "JC", role: "Staff", lastMessage: "I'll cover the afternoon session.", time: "Yesterday", unread: 1,
    messages: [
      { id: "msg7", sender: "them", text: "Can someone cover my afternoon group today? I have a doctor appointment.", time: "Yesterday 8:00 AM" },
      { id: "msg8", sender: "me", text: "I'll arrange coverage. Please submit a leave request form.", time: "Yesterday 8:30 AM" },
      { id: "msg9", sender: "them", text: "I'll cover the afternoon session.", time: "Yesterday 9:00 AM" },
    ]
  },
];

export const mockNotifications: Notification[] = [
  { id: "n1", type: "warning", title: "Allergy Alert", description: "Emma Johnson had a mild allergic reaction. Antihistamine administered.", time: "10 min ago", read: false },
  { id: "n2", type: "info", title: "New Admission Request", description: "Lucas Moore's parent submitted an admission application.", time: "1 hour ago", read: false },
  { id: "n3", type: "success", title: "Payment Received", description: "Michael Smith paid June tuition invoice #INV-002.", time: "2 hours ago", read: false },
  { id: "n4", type: "error", title: "Overdue Invoice", description: "Robert Davis has an overdue invoice from May 2026.", time: "3 hours ago", read: true },
  { id: "n5", type: "info", title: "Staff on Leave", description: "Rachel Green (Nurse) is on medical leave today.", time: "Yesterday", read: true },
  { id: "n6", type: "warning", title: "Bus Delay", description: "Van B (South Route) is running 15 minutes late.", time: "Yesterday", read: true },
  { id: "n7", type: "success", title: "Activity Completed", description: "Morning Circle Time completed successfully for all groups.", time: "Yesterday", read: true },
];

export const enrollmentTrend = [
  { month: "Jan", enrolled: 28 }, { month: "Feb", enrolled: 30 }, { month: "Mar", enrolled: 32 },
  { month: "Apr", enrolled: 31 }, { month: "May", enrolled: 35 }, { month: "Jun", enrolled: 36 },
];

export const attendanceData = [
  { day: "Mon", present: 30, absent: 6 }, { day: "Tue", present: 33, absent: 3 },
  { day: "Wed", present: 31, absent: 5 }, { day: "Thu", present: 34, absent: 2 }, { day: "Fri", present: 28, absent: 8 },
];

export const ageDistribution = [
  { name: "1-2 yrs", value: 8 }, { name: "2-3 yrs", value: 12 }, { name: "3-4 yrs", value: 10 }, { name: "4-5 yrs", value: 6 },
];

export const revenueData = [
  { month: "Jan", revenue: 24500 }, { month: "Feb", revenue: 26000 }, { month: "Mar", revenue: 27200 },
  { month: "Apr", revenue: 26800 }, { month: "May", revenue: 29400 }, { month: "Jun", revenue: 30600 },
];
