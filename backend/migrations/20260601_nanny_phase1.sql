CREATE TABLE IF NOT EXISTS nanny_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nanny_id INT NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- 'id', 'address', 'police', 'medical'
  file_url VARCHAR(1024),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (nanny_id, document_type)
);
