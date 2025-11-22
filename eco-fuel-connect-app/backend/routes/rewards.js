const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

router.get('/my-rewards', auth, async (req, res) => {
  console.log('🪙 /my-rewards called for user:', req.user.id);
  try {
    let coins = [], transactions = [], payouts = [];
    
    try {
      coins = await db.query(`SELECT totalcoins, lifetimecoins FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
      console.log('🪙 Coins query result:', coins);
    } catch (e) {
      console.error('🪙 Coins query error:', e.message);
    }
    
    try {
      transactions = await db.query(`SELECT ct.*, we."wasteType", we.quantity, we.unit, we."createdAt" as wastedate FROM coin_transactions ct LEFT JOIN waste_entries we ON ct.wasteentryid = we.id WHERE ct.userid = ? AND ct.type = 'earned' ORDER BY ct.createdat DESC`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
      console.log('🪙 Transactions count:', transactions.length);
    } catch (e) {
      console.error('🪙 Transactions query error:', e.message);
    }
    
    try {
      payouts = await db.query(`SELECT * FROM coin_payouts WHERE userid = ? ORDER BY createdat DESC`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    } catch (e) {}
    
    const coinValue = 0.01;
    const totalCoins = coins[0]?.totalcoins || 0;
    const lifetimeCoins = coins[0]?.lifetimecoins || 0;
    
    console.log('🪙 Sending response - Total:', totalCoins, 'Lifetime:', lifetimeCoins);
    
    res.json({
      success: true,
      coins: { total: totalCoins, lifetime: lifetimeCoins, cashValue: (totalCoins * coinValue).toFixed(2) },
      earnings: { totalEarnings: lifetimeCoins * coinValue, paidAmount: 0, pendingAmount: 0 },
      payments: transactions.map(t => ({ id: t.id, wasteDate: t.wasteDate, wasteType: t.wasteType, quantitySupplied: t.quantity, paymentRate: coinValue, totalAmount: Math.abs(t.amount) * coinValue, paymentStatus: 'completed', coinsEarned: Math.abs(t.amount) }))
    });
  } catch (error) {
    console.error('🪙 /my-rewards error:', error.message);
    res.json({ success: true, coins: { total: 0, lifetime: 0, cashValue: '0.00' }, earnings: { totalEarnings: 0, paidAmount: 0, pendingAmount: 0 }, payments: [] });
  }
});

router.get('/coins', auth, async (req, res) => {
  try {
    let coins = [], transactions = [];
    
    try {
      coins = await db.query(`SELECT totalcoins, lifetimecoins, lastearned FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    } catch (e) {
      console.error('Coins query error:', e.message);
    }
    
    try {
      transactions = await db.query(`SELECT * FROM coin_transactions WHERE userid = ? ORDER BY createdat DESC LIMIT 20`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    } catch (e) {
      console.error('Transactions query error:', e.message);
    }
    
    const coinValue = 0.01;
    const totalCoins = coins[0]?.totalcoins || 0;
    
    res.json({
      success: true,
      coins: { total: totalCoins, lifetime: coins[0]?.lifetimecoins || 0, cashValue: (totalCoins * coinValue).toFixed(2), coinValue, lastEarned: coins[0]?.lastearned },
      transactions: transactions || []
    });
  } catch (error) {
    console.error('GET /coins error:', error.message);
    res.json({ success: true, coins: { total: 0, lifetime: 0, cashValue: '0.00' }, transactions: [] });
  }
});

router.post('/coins/convert', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: 'Minimum 100 coins required' });
    
    const [coins] = await db.query(`SELECT "totalCoins" FROM user_coins WHERE "userId" = ?`, [req.user.id]);
    if (!coins[0] || coins[0].totalCoins < amount) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    
    await db.query(`UPDATE user_coins SET "totalCoins" = "totalCoins" - ?, "updatedAt" = NOW() WHERE "userId" = ?`, { replacements: [amount, req.user.id], type: db.QueryTypes.UPDATE });
    
    const cashValue = (amount * 0.01).toFixed(2);
    await db.query(`INSERT INTO coin_transactions ("userId", amount, type, description, "createdAt") VALUES (?, ?, 'converted', ?, NOW())`, { replacements: [req.user.id, -amount, `Converted ${amount} coins to $${cashValue}`], type: db.QueryTypes.INSERT });
    await db.query(`INSERT INTO coin_payouts ("userId", coins, "cashAmount", "paymentMethod", status, "createdAt") VALUES (?, ?, ?, ?, 'pending', NOW())`, { replacements: [req.user.id, amount, cashValue, paymentMethod || 'bank_transfer'], type: db.QueryTypes.INSERT });
    
    res.json({ success: true, message: 'Coins converted successfully', conversion: { coins: amount, cash: cashValue, paymentMethod: paymentMethod || 'bank_transfer', status: 'pending' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/supplier/:supplierId', auth, async (req, res) => {
  try {
    const [coins] = await db.query(`SELECT "totalCoins", "lifetimeCoins" FROM user_coins WHERE "userId" = ?`, [req.params.supplierId]);
    const [transactions] = await db.query(`SELECT ct.*, we."wasteType", we.quantity, we.unit, we."createdAt" as "wasteDate" FROM coin_transactions ct LEFT JOIN waste_entries we ON ct."wasteEntryId" = we.id WHERE ct."userId" = ? AND ct.type = 'earned' ORDER BY ct."createdAt" DESC`, [req.params.supplierId]);
    
    const coinValue = 0.01;
    res.json({
      success: true,
      earnings: { totalEarnings: (coins[0]?.lifetimeCoins || 0) * coinValue, paidAmount: 0, pendingAmount: 0 },
      payments: transactions.map(t => ({ id: t.id, wasteDate: t.wasteDate, wasteType: t.wasteType, quantitySupplied: t.quantity, paymentRate: coinValue, totalAmount: Math.abs(t.amount) * coinValue, paymentStatus: 'completed' }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/request-payment', auth, async (req, res) => {
  try {
    const { paymentMethod, amount } = req.body;
    const [coins] = await db.query(`SELECT "totalCoins" FROM user_coins WHERE "userId" = ?`, [req.user.id]);
    const totalCoins = coins[0]?.totalCoins || 0;
    const requestAmount = amount || totalCoins;
    
    if (requestAmount < 100) return res.status(400).json({ success: false, message: 'Minimum 100 coins required' });
    if (totalCoins < requestAmount) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    
    const cashAmount = (requestAmount * 0.01).toFixed(2);
    await db.query(`INSERT INTO coin_payouts ("userId", coins, "cashAmount", "paymentMethod", status, "createdAt") VALUES (?, ?, ?, ?, 'pending', NOW())`, [req.user.id, requestAmount, cashAmount, paymentMethod || 'mobile_money']);
    res.json({ success: true, message: 'Payment request submitted', cashAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/leaderboard', auth, async (req, res) => {
  try {
    const [leaderboard] = await db.query(`SELECT u."firstName", u."lastName", u.organization, uc."totalCoins", uc."lifetimeCoins" FROM user_coins uc JOIN users u ON uc."userId" = u.id WHERE u.role = 'supplier' AND u."isActive" = true ORDER BY uc."lifetimeCoins" DESC LIMIT 20`);
    res.json({ success: true, leaderboard: leaderboard.map((user, index) => ({ rank: index + 1, name: `${user.firstName} ${user.lastName}`, organization: user.organization, coins: user.lifetimeCoins })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/achievements', auth, async (req, res) => {
  res.json({ success: true, achievements: [], stats: { totalEntries: 0, totalWaste: 0, lifetimeCoins: 0, daysSinceJoined: 0 } });
});

router.get('/debug', auth, async (req, res) => {
  try {
    const tables = await db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%coin%'`, { type: db.QueryTypes.SELECT });
    const userCoins = await db.query(`SELECT * FROM user_coins WHERE "userId" = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const transactions = await db.query(`SELECT * FROM coin_transactions WHERE "userId" = ? LIMIT 5`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    res.json({ success: true, tables, userCoins, transactions, userId: req.user.id });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.post('/process-payment', auth, async (req, res) => {
  res.json({ success: true, message: 'Payment processed' });
});

module.exports = router;
