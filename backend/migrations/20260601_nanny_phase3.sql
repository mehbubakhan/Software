CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  child_age VARCHAR(50),
  child_personality VARCHAR(100),
  salary_amount VARCHAR(50),
  salary_type VARCHAR(50),
  schedule VARCHAR(100),
  requirements JSON,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  nanny_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (job_id, nanny_id)
);
