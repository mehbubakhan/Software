-- Adoption Module Tables

SET FOREIGN_KEY_CHECKS = 0;

-- 1. orphanages
CREATE TABLE IF NOT EXISTS adoption_orphanages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orphanage_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  address TEXT,
  contact_number VARCHAR(50),
  email VARCHAR(100),
  description TEXT,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  profile_image VARCHAR(500),
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. children
CREATE TABLE IF NOT EXISTS adoption_children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orphanage_id INT NOT NULL,
  child_name VARCHAR(255) NOT NULL,
  age VARCHAR(50),
  gender VARCHAR(50),
  health_condition TEXT,
  interests TEXT,
  short_description TEXT,
  profile_image VARCHAR(500),
  adoption_status ENUM('available', 'meetup_phase', 'under_review', 'adopted') DEFAULT 'available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orphanage_id) REFERENCES adoption_orphanages(id) ON DELETE CASCADE
);

-- 3. adoption_applications
CREATE TABLE IF NOT EXISTS adoption_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  child_id INT NOT NULL,
  orphanage_id INT NOT NULL,
  application_status ENUM('pending', 'under_review', 'meetup_phase', 'compatibility_evaluation', 'approved', 'rejected', 'follow_up_ongoing') DEFAULT 'pending',
  submitted_documents JSON,
  meetup_count INT DEFAULT 0,
  compatibility_score INT DEFAULT 0,
  final_decision TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (child_id) REFERENCES adoption_children(id) ON DELETE CASCADE,
  FOREIGN KEY (orphanage_id) REFERENCES adoption_orphanages(id) ON DELETE CASCADE
);

-- 4. meetups
CREATE TABLE IF NOT EXISTS adoption_meetups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  meetup_date DATE,
  meetup_time TIME,
  location VARCHAR(255),
  meeting_type ENUM('virtual', 'in_person') DEFAULT 'in_person',
  notes TEXT,
  attendance_status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. qa_responses
CREATE TABLE IF NOT EXISTS adoption_qa_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  parent_questions JSON,
  parent_answers JSON,
  orphanage_observations TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE
);

-- 6. counselling_sessions
CREATE TABLE IF NOT EXISTS adoption_counselling_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  counsellor_name VARCHAR(255),
  session_date DATETIME,
  session_type ENUM('pre_adoption', 'post_adoption', 'general') DEFAULT 'general',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. follow_ups
CREATE TABLE IF NOT EXISTS adoption_follow_ups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  followup_date DATE,
  child_condition TEXT,
  family_condition TEXT,
  remarks TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE
);

-- 8. adoption_documents
CREATE TABLE IF NOT EXISTS adoption_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  doc_type VARCHAR(100) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verified_by INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. adoption_notifications
CREATE TABLE IF NOT EXISTS adoption_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. adoption_payments
CREATE TABLE IF NOT EXISTS adoption_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE
);

-- 11. adoption_audit_logs
CREATE TABLE IF NOT EXISTS adoption_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  action_by INT NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES adoption_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (action_by) REFERENCES users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
