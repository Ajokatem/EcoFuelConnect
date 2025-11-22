-- Create user_coins table
CREATE TABLE IF NOT EXISTS user_coins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  totalCoins INT DEFAULT 0,
  lifetimeCoins INT DEFAULT 0,
  lastEarned DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user (userId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create coin_transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  amount INT NOT NULL,
  type ENUM('earned', 'converted', 'bonus', 'penalty') NOT NULL,
  description TEXT,
  wasteEntryId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create coin_payouts table
CREATE TABLE IF NOT EXISTS coin_payouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  coins INT NOT NULL,
  cashAmount DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50) DEFAULT 'bank_transfer',
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  processedAt DATETIME,
  processedBy INT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (processedBy) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_user_coins_userId ON user_coins(userId);
CREATE INDEX idx_coin_transactions_userId ON coin_transactions(userId);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX idx_coin_payouts_userId ON coin_payouts(userId);
CREATE INDEX idx_coin_payouts_status ON coin_payouts(status);
