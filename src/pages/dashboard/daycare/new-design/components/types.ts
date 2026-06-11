export type Section =
  | "dashboard"
  | "children"
  | "applications"
  | "parents"
  | "staff"
  | "live-monitoring"
  | "transportation"
  | "daily-activities"
  | "health-medicine"
  | "billing"
  | "complaints"
  | "chat"
  | "notifications"
  | "analytics"
  | "settings"
  | "profile"
  | "ai-center"
  | "reviews";

export interface Child {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: "Male" | "Female";
  group: string;
  parentId: string;
  parentName: string;
  allergies: string;
  status: "Active" | "Inactive";
  enrollDate: string;
  photo?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  children: string[];
  emergencyContact: string;
  status: "Active" | "Inactive";
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  shift: string;
  group: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
}

export interface Admission {
  id: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  dob: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Waitlisted";
  notes: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  driverPhone: string;
  route: string;
  capacity: number;
  children: string[];
  status: "Active" | "Inactive" | "En Route";
}

export interface Activity {
  id: string;
  title: string;
  group: string;
  date: string;
  time: string;
  instructor: string;
  type: "Educational" | "Physical" | "Arts" | "Social" | "Meal";
  description: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

export interface HealthRecord {
  id: string;
  childId: string;
  childName: string;
  type: "Medication" | "Incident" | "Checkup" | "Allergy";
  date: string;
  description: string;
  nurse: string;
  status: "Active" | "Resolved";
}

export interface Invoice {
  id: string;
  parentName: string;
  childName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  description: string;
}

export interface Complaint {
  id: string;
  parentName: string;
  subject: string;
  description: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  assignedTo: string;
}

export interface Message {
  id: string;
  from: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
  time: string;
  read: boolean;
}
