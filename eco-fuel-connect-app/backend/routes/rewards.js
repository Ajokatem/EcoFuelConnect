const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

// Get user coins balance
router.get('/coins', auth, async (req, res) => {
  try {
    const [coins] = await db.query(`
      SELECT totalCoins, lifetimeCoins, lastEarned FROM user_coins WHERE userId = ?
    `, [req.user.id]);
    
    const [transactions] = await db.query(`
      SELECT * FROM coin_transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 20
    `, [req.user.id]);
    
    const coinValue = 0.01; // 1 coin = $0.01 (100 coins = $1)
    const totalCoins = coins[0]?.totalCoins || 0;
    
    res.json({
      success: true,
      coins: {
        total: totalCoins,
        lifetime: coins[0]?.lifetimeCoins || 0,
        cashValue: (totalCoins * coinValue).toFixed(2),
        coinValue,
        lastEarned: coins[0]?.lastEarned
      },
      transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Convert coins to cash
router.post('/coins/convert', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum 100 coins required for conversion' });
    }
    
    const [coins] = await db.query(`
      SELECT totalCoins FROM user_coins WHERE userId = ?
    `, [req.user.id]);
    
    if (!coins[0] || coins[0].totalCoins < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient coins' });
    }
    
    // Deduct coins
    await db.query(`
      UPDATE user_coins SET totalCoins = totalCoins - ?, updatedAt = NOW() WHERE userId = ?
    `, [amount, req.user.id]);
    
    // Log transaction
    const cashValue = (amount * 0.01).toFixed(2);
    await db.query(`
      INSERT INTO coin_transactions (userId, amount, type, description, createdAt)
      VALUES (?, ?, 'converted', ?, NOW())
    `, [req.user.id, -amount, `Converted ${amount} coins to $${cashValue}`]);
    
    // Create cash payout request
    await db.query(`
      INSERT INTO coin_payouts (userId, coins, cashAmount, paymentMethod, status, createdAt)
      VALUES (?, ?, ?, ?, 'pending', NOW())
    `, [req.user.id, amount, cashValue, paymentMethod || 'bank_transfer']);
    
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: req.user.id,
      type: 'reward',
      title: '💰 Coin Conversion Successful',
      message: `You converted ${amount} coins to $${cashValue}. Payment will be processed within 3-5 business days.`,
      read: false
    });
    
    res.json({
      success: true,
      message: 'Coins converted successfully',
      conversion: {
        coins: amount,
        cash: cashValue,
        paymentMethod: paymentMethod || 'bank_transfer',
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get supplier earnings/rewards
router.get('/supplier/:supplierId', auth, async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    const [earnings] = await db.query(`
      SELECT * FROM supplier_earnings WHERE supplierId = ?
    `, [supplierId]);

    const [payments] = await db.query(`
      SELECT sp.*, we.wasteType, we.createdAt as wasteDate
      FROM supplier_payments sp
      JOIN wasteentries we ON sp.wasteEntryId = we.id
      WHERE sp.supplierId = ?
      ORDER BY sp.createdAt DESC
    `, [supplierId]);

    res.json({
      success: true,
      earnings: earnings[0] || { totalEarnings: 0, paidAmount: 0, pendingAmount: 0 },
      payments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Request payment
router.post('/request-payment', auth, async (req, res) => {
  try {
    const { paymentIds, paymentMethod } = req.body;
    
    await db.query(`
      UPDATE supplier_payments 
      SET paymentStatus = 'approved', paymentMethod = ?
      WHERE id IN (?) AND paymentStatus = 'pending'
    `, [paymentMethod, paymentIds]);

    res.json({ success: true, message: 'Payment request submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const [leaderboard] = await db.query(`
      SELECT u.firstName, u.lastName, u.organization, uc.totalCoins, uc.lifetimeCoins,
             COUNT(we.id) as wasteEntries,
             SUM(we.estimatedWeight) as totalWaste
      FROM user_coins uc
      JOIN users u ON uc.userId = u.id
      LEFT JOIN wasteentries we ON u.id = we.supplierId
      WHERE u.role = 'supplier' AND u.isActive = 1
      GROUP BY u.id
      ORDER BY uc.lifetimeCoins DESC
      LIMIT 20
    `);
    
    res.json({
      success: true,
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        name: `${user.firstName} ${user.lastName}`,
        organization: user.organization,
        coins: user.lifetimeCoins,
        wasteEntries: user.wasteEntries || 0,
        totalWaste: user.totalWaste || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const [userStats] = await db.query(`
      SELECT 
        COUNT(we.id) as totalEntries,
        SUM(we.estimatedWeight) as totalWaste,
        uc.lifetimeCoins,
        DATEDIFF(NOW(), u.createdAt) as daysSinceJoined
      FROM users u
      LEFT JOIN wasteentries we ON u.id = we.supplierId
      LEFT JOIN user_coins uc ON u.id = uc.userId
      WHERE u.id = ?
      GROUP BY u.id
    `, [req.user.id]);
    
    const stats = userStats[0] || { totalEntries: 0, totalWaste: 0, lifetimeCoins: 0, daysSinceJoined: 0 };
    
    const achievements = [
      {
        id: 'first_entry',
        title: 'First Steps',
        description: 'Log your first waste entry',
        icon: '🌱',
        unlocked: stats.totalEntries >= 1,
        progress: Math.min(stats.totalEntries, 1),
        target: 1
      },
      {
        id: 'waste_warrior',
        title: 'Waste Warrior',
        description: 'Log 10 waste entries',
        icon: '⚔️',
        unlocked: stats.totalEntries >= 10,
        progress: Math.min(stats.totalEntries, 10),
        target: 10
      },
      {
        id: 'eco_champion',
        title: 'Eco Champion',
        description: 'Contribute 100kg of waste',
        icon: '🏆',
        unlocked: stats.totalWaste >= 100,
        progress: Math.min(stats.totalWaste, 100),
        target: 100
      },
      {
        id: 'coin_collector',
        title: 'Coin Collector',
        description: 'Earn 1000 coins',
        icon: '🪙',
        unlocked: stats.lifetimeCoins >= 1000,
        progress: Math.min(stats.lifetimeCoins, 1000),
        target: 1000
      },
      {
        id: 'loyal_supplier',
        title: 'Loyal Supplier',
        description: 'Active for 30 days',
        icon: '💎',
        unlocked: stats.daysSinceJoined >= 30,
        progress: Math.min(stats.daysSinceJoined, 30),
        target: 30
      }
    ];
    
    res.json({
      success: true,
      achievements,
      stats: {
        totalEntries: stats.totalEntries,
        totalWaste: stats.totalWaste,
        lifetimeCoins: stats.lifetimeCoins,
        daysSinceJoined: stats.daysSinceJoined
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Process payments
router.post('/process-payment', auth, async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    await db.query(`
      UPDATE supplier_payments 
      SET paymentStatus = 'completed', 
          paymentDate = NOW(),
          processedBy = ?
      WHERE id = ?
    `, [req.user.id, paymentId]);

    res.json({ success: true, message: 'Payment processed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
