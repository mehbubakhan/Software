-- Marketplace Extension Schema

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Sellers extension (seller profiles linked to users)
CREATE TABLE IF NOT EXISTS seller_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  logo VARCHAR(100),
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(255),
  revenue VARCHAR(100) DEFAULT '৳0',
  status VARCHAR(50) DEFAULT 'Pending',
  trade_license BOOLEAN DEFAULT FALSE,
  nid_verified BOOLEAN DEFAULT FALSE,
  bank_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(100),
  joined_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Modify existing products table
ALTER TABLE products 
  ADD COLUMN status VARCHAR(50) DEFAULT 'Pending Review',
  ADD COLUMN age_group VARCHAR(100),
  ADD COLUMN safety_status VARCHAR(100) DEFAULT 'Under Review',
  ADD COLUMN featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN sold INT DEFAULT 0,
  ADD COLUMN returned INT DEFAULT 0,
  ADD COLUMN remaining INT DEFAULT 0,
  ADD COLUMN warehouse VARCHAR(100) DEFAULT 'WH-A';

-- 3. Modify existing orders table
ALTER TABLE orders
  ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Pending',
  ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'Pending',
  ADD COLUMN phone VARCHAR(100),
  ADD COLUMN customer_name VARCHAR(255),
  ADD COLUMN order_date DATE;

-- 4. Deliveries
CREATE TABLE IF NOT EXISTS marketplace_deliveries (
  id VARCHAR(50) PRIMARY KEY,
  order_id INT NOT NULL,
  courier VARCHAR(100),
  tracking_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'In Transit',
  estimated_date DATE,
  weight VARCHAR(50),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 5. Payments / Withdrawals
CREATE TABLE IF NOT EXISTS marketplace_payments (
  id VARCHAR(50) PRIMARY KEY,
  seller_id INT NOT NULL,
  amount VARCHAR(100),
  method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  request_date DATE,
  account_info VARCHAR(255),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Complaints
CREATE TABLE IF NOT EXISTS marketplace_complaints (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(100),
  reporter VARCHAR(255),
  seller_id INT,
  product_id INT,
  priority VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Open',
  complaint_date DATE,
  description TEXT,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. Modify existing product_reviews table
ALTER TABLE product_reviews
  ADD COLUMN status VARCHAR(50) DEFAULT 'Visible',
  ADD COLUMN helpful INT DEFAULT 0,
  ADD COLUMN review_date DATE;

-- 8. Notifications
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  time_display VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(50)
);

SET FOREIGN_KEY_CHECKS = 1;
