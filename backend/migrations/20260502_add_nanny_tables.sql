-- Migration: add nanny_profiles, availability, safety_responses, sos_events
CREATE TABLE IF NOT EXISTS nanny_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  bio TEXT,
  experience TEXT,
  skills TEXT,
  photo_url VARCHAR(1024),
  verified TINYINT DEFAULT 0,
  UNIQUE KEY (nanny_id)
);

CREATE TABLE IF NOT EXISTS availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  data TEXT,
  INDEX (nanny_id)
);

CREATE TABLE IF NOT EXISTS safety_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  check_id VARCHAR(255),
  nanny_id INT NOT NULL,
  response VARCHAR(50),
  note TEXT,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS sos_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  lat DOUBLE NULL,
  lng DOUBLE NULL,
  message TEXT,
  created_at DATETIME
);
