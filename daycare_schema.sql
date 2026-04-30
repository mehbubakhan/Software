-- daycare_schema.sql
-- SQL schema for `daycare_management_system`
-- Run in phpMyAdmin or via mysql CLI:
-- CREATE DATABASE daycare_management_system; USE daycare_management_system;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin','parent','nanny','transport_staff','staff') NOT NULL DEFAULT 'parent',
  `status` ENUM('active','inactive','pending','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `parents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `phone` VARCHAR(30),
  `address` VARCHAR(255),
  `emergency_contact` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `children` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100),
  `date_of_birth` DATE,
  `gender` ENUM('male','female','other') DEFAULT 'other',
  `allergies` TEXT,
  `medical_info` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `daycare_centers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `address` VARCHAR(255),
  `phone` VARCHAR(50),
  `capacity` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `nanny_profiles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `bio` TEXT,
  `experience_years` INT DEFAULT 0,
  `qualifications` TEXT,
  `status` ENUM('available','assigned','inactive') DEFAULT 'available',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `transport_staff` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `vehicle_type` VARCHAR(100),
  `vehicle_number` VARCHAR(100),
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `packages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `monthly_fee` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admission_applications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT UNSIGNED NOT NULL,
  `child_id` INT UNSIGNED NOT NULL,
  `daycare_center_id` INT UNSIGNED,
  `package_id` INT UNSIGNED,
  `status` ENUM('pending','accepted','rejected','withdrawn') DEFAULT 'pending',
  `notes` TEXT,
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`daycare_center_id`) REFERENCES `daycare_centers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `job_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255),
  `posted_by` INT UNSIGNED,
  `status` ENUM('open','closed') DEFAULT 'open',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`posted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `nanny_applications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `job_post_id` INT UNSIGNED NOT NULL,
  `nanny_user_id` INT UNSIGNED NOT NULL,
  `cover_letter` TEXT,
  `status` ENUM('pending','interview','rejected','hired') DEFAULT 'pending',
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_post_id`) REFERENCES `job_posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`nanny_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `nanny_child_assignments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nanny_profile_id` INT UNSIGNED NOT NULL,
  `child_id` INT UNSIGNED NOT NULL,
  `assigned_at` DATE NOT NULL,
  `unassigned_at` DATE DEFAULT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`nanny_profile_id`) REFERENCES `nanny_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `transport_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transport_staff_id` INT UNSIGNED NOT NULL,
  `child_id` INT UNSIGNED NOT NULL,
  `route` VARCHAR(255),
  `pickup_time` DATETIME,
  `dropoff_time` DATETIME,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`transport_staff_id`) REFERENCES `transport_staff`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED NOT NULL,
  `subject` VARCHAR(255),
  `body` TEXT,
  `read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `type` VARCHAR(100),
  `message` TEXT,
  `read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Sample dummy data for testing
INSERT INTO `users` (email, password_hash, first_name, last_name, role) VALUES
('admin@example.com','$2y$10$adminhash','Admin','User','admin'),
('parent1@example.com','$2y$10$parenthash','Parent','One','parent'),
('nanny1@example.com','$2y$10$nannyhash','Nanny','One','nanny'),
('transport1@example.com','$2y$10$trhash','Driver','One','transport_staff');

INSERT INTO `parents` (user_id, phone, address, emergency_contact) VALUES
(2,'+1-555-1111','123 Maple St','Mom: +1-555-2222');

INSERT INTO `daycare_centers` (name,address,phone,capacity) VALUES
('Happy Kids Daycare','10 Child Ln','+1-555-3333',50);

INSERT INTO `children` (parent_id, first_name, last_name, date_of_birth, gender, allergies) VALUES
(1,'Alice','One','2018-05-10','female','Peanuts'),
(1,'Bobby','One','2020-08-15','male',NULL);

INSERT INTO `nanny_profiles` (user_id, bio, experience_years, qualifications) VALUES
(3,'Experienced nanny with CPR training',5,'CPR,First Aid');

INSERT INTO `transport_staff` (user_id, vehicle_type, vehicle_number) VALUES
(4,'Van','ABC-123');

INSERT INTO `packages` (name,description,monthly_fee) VALUES
('Basic','Half-day care',200.00),
('Full','Full-day care',400.00);

INSERT INTO `admission_applications` (parent_id, child_id, daycare_center_id, package_id, status, notes) VALUES
(1,1,1,2,'pending','Needs full-day care starting June');

INSERT INTO `job_posts` (title,description,location,posted_by) VALUES
('Full-time Nanny','Looking for experienced nanny','Happy Kids Daycare',1);

INSERT INTO `nanny_applications` (job_post_id,nanny_user_id,cover_letter,status) VALUES
(1,3,'I have 5 years experience and love children','pending');

INSERT INTO `nanny_child_assignments` (nanny_profile_id, child_id, assigned_at, notes) VALUES
(1,1,'2024-09-01','Primary caregiver for mornings');

INSERT INTO `activity_logs` (user_id,action,details) VALUES
(2,'profile_update','Parent updated phone number');

INSERT INTO `transport_logs` (transport_staff_id,child_id,route,pickup_time,dropoff_time,notes) VALUES
(1,2,'Route A','2024-05-01 07:30:00','2024-05-01 09:00:00','On time');

INSERT INTO `messages` (sender_id,receiver_id,subject,body) VALUES
(1,2,'Welcome','Welcome to Happy Kids Daycare!');

INSERT INTO `notifications` (user_id,type,message) VALUES
(2,'admission','Your application status changed to pending');

-- End of schema
