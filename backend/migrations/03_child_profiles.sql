CREATE TABLE IF NOT EXISTS children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  allergies TEXT,
  profile_photo VARCHAR(255),
  learning_level VARCHAR(50) DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS child_growth_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  height DECIMAL(5, 2), -- cm
  weight DECIMAL(5, 2), -- kg
  bmi DECIMAL(4, 2),
  recorded_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS child_health_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  diagnosis VARCHAR(255),
  medications TEXT,
  doctor_notes TEXT,
  hospital_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  vaccine_name VARCHAR(255) NOT NULL,
  due_date DATE,
  completed_date DATE,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
