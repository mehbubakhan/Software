CREATE TABLE IF NOT EXISTS nanny_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  availability_date DATE,
  status VARCHAR(50) DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nanny_shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  job_id INT,
  check_in DATETIME,
  check_out DATETIME,
  status VARCHAR(50) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nanny_safety_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  shift_id INT,
  type VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nanny_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  course_name VARCHAR(255),
  completion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  certificate_url VARCHAR(255),
  FOREIGN KEY (nanny_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Try to add new columns to nanny_profiles
-- If they already exist, this will error, but we'll ignore it in the script or run via alter statements with care.
