-- NOKOSKU MAIN SCHEMA
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(128),
  balance BIGINT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  nominal BIGINT NOT NULL,
  metode VARCHAR(64) NOT NULL,
  status ENUM('pending','processing','success','expired','cancel') NOT NULL,
  expired_at DATETIME,
  paid_at DATETIME,
  provider_response JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  service VARCHAR(128) NOT NULL,
  country VARCHAR(64) NOT NULL,
  operator VARCHAR(64),
  number VARCHAR(32),
  status ENUM('pending','processing','otp_received','expired','cancel') NOT NULL,
  otp_code VARCHAR(32),
  otp_resend INT DEFAULT 0,
  expired_at DATETIME,
  provider_response JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transaction logs
CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type ENUM('deposit','order','refund','profit') NOT NULL,
  related_id BIGINT,
  amount BIGINT NOT NULL,
  profit BIGINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Profit logs
CREATE TABLE IF NOT EXISTS profit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  base_price BIGINT NOT NULL,
  markup BIGINT NOT NULL,
  fee BIGINT DEFAULT 0,
  selling_price BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Markup rules
CREATE TABLE IF NOT EXISTS markup_rules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  service VARCHAR(128),
  country VARCHAR(64),
  operator VARCHAR(64),
  markup BIGINT DEFAULT 1000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  event VARCHAR(128),
  detail TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);