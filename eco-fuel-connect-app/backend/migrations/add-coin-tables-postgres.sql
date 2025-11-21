-- Create user_coins table for PostgreSQL
CREATE TABLE IF NOT EXISTS user_coins (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "totalCoins" INT DEFAULT 0,
  "lifetimeCoins" INT DEFAULT 0,
  "lastEarned" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE ("userId")
);

-- Create coin_transactions table for PostgreSQL
CREATE TABLE IF NOT EXISTS coin_transactions (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "wasteEntryId" INT,
  amount INT NOT NULL,
  type VARCHAR(20) DEFAULT 'earned' CHECK (type IN ('earned', 'converted', 'bonus', 'penalty')),
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY ("wasteEntryId") REFERENCES waste_entries(id) ON DELETE SET NULL
);

-- Create coin_payouts table for PostgreSQL
CREATE TABLE IF NOT EXISTS coin_payouts (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  coins INT NOT NULL,
  "cashAmount" DECIMAL(10,2) NOT NULL,
  "paymentMethod" VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  "processedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_coins_userId ON user_coins("userId");
CREATE INDEX IF NOT EXISTS idx_coin_transactions_userId ON coin_transactions("userId");
CREATE INDEX IF NOT EXISTS idx_coin_transactions_wasteEntryId ON coin_transactions("wasteEntryId");
CREATE INDEX IF NOT EXISTS idx_coin_payouts_userId ON coin_payouts("userId");
CREATE INDEX IF NOT EXISTS idx_coin_payouts_status ON coin_payouts(status);
