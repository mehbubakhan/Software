CREATE TABLE IF NOT EXISTS child_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  module VARCHAR(100) NOT NULL,
  lesson VARCHAR(100) NOT NULL,
  score INT DEFAULT 0,
  stars INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS child_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  reward_type VARCHAR(50) NOT NULL,
  points INT DEFAULT 0,
  unlocked_item VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collaborative_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_name VARCHAR(100) NOT NULL,
  created_by INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES children(id) ON DELETE SET NULL
);

-- Adding some screen time rules to existing children table if they don't exist
-- Although it's safer to just use a separate child_settings table or alter children table.
-- Let's add child_settings to avoid altering children for now.
CREATE TABLE IF NOT EXISTS child_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT UNIQUE,
  screen_time_limit INT DEFAULT 60, -- in minutes
  allowed_modules TEXT, -- JSON or comma separated
  multiplayer_permission BOOLEAN DEFAULT FALSE,
  chat_restriction BOOLEAN DEFAULT TRUE,
  camera_mic_permission BOOLEAN DEFAULT FALSE,
  reward_rules TEXT,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
