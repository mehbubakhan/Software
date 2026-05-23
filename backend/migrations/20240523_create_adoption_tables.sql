-- migrations/20240523_create_adoption_tables.sql
-- Auto‑generated migration for Baby Adoption (Orphanage Care) module

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    consent_given TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE orphanages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orphanage_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male','Female','Other') NOT NULL,
    health_status TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orphanage_id) REFERENCES orphanages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('Pending','Verified','Legal','Meeting','Adopted','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    public_id VARCHAR(255),
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    meeting_link VARCHAR(500),
    status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE counselling_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    counsellor_id INT NOT NULL,
    notes TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_children_orphanage ON children(orphanage_id);
CREATE INDEX idx_applications_child_user ON applications(child_id, user_id);
CREATE INDEX idx_documents_app ON documents(application_id);
CREATE INDEX idx_meetings_app ON meetings(application_id);
CREATE INDEX idx_counselling_app ON counselling_sessions(application_id);

/* End of migration */
