SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users, children, activities, admissions, jobs, applications;
DROP TABLE IF EXISTS activity_logs, admission_applications, daycare_centers, job_posts, messages, nanny_applications, nanny_child_assignments, nanny_profiles, notifications, packages, parents, transport_logs, transport_staff;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT NOT NULL,
  dob DATE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  nanny_id INT NOT NULL,
  type VARCHAR(100),
  details TEXT,
  created_at DATETIME,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  parent_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  admin_id INT NOT NULL,
  vacancies INT DEFAULT 1,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at DATETIME,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  nanny_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
