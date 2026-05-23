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

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  image_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tracking_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'Placed',
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daycare Tables
CREATE TABLE IF NOT EXISTS daycares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  license VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  working_hours VARCHAR(100),
  capacity INT,
  description TEXT,
  facilities JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  type ENUM('hourly', 'daily', 'weekly', 'monthly'),
  price DECIMAL(10,2) NOT NULL,
  age_group VARCHAR(100),
  duration VARCHAR(100),
  features JSON,
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  parent_id INT NOT NULL,
  child_name VARCHAR(255) NOT NULL,
  child_age INT NOT NULL,
  package_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES daycare_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  parent_id INT NOT NULL,
  child_name VARCHAR(255) NOT NULL,
  child_age INT NOT NULL,
  package_id INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES daycare_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(100),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_daily_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  child_id INT NOT NULL,
  type ENUM('meal', 'sleep', 'learning', 'activity') NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  time_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE,
  FOREIGN KEY (child_id) REFERENCES daycare_children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daycare_transport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  daycare_id INT NOT NULL,
  van_number VARCHAR(50) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  driver_phone VARCHAR(50),
  route TEXT,
  status ENUM('idle', 'in_transit') DEFAULT 'idle',
  FOREIGN KEY (daycare_id) REFERENCES daycares(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
