const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

router.get('/my-rewards', auth, async (req, res) => {
  try {
    const coins = await db.query(`SELECT totalcoins, lifetimecoins FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const transactions = await db.query(`SELECT ct.id, ct.amount, ct.type, ct.description, ct.createdat, we."wasteType", we."estimatedWeight", we.quantity, we.unit, we."createdAt" as wastedate FROM coin_transactions ct LEFT JOIN waste_entries we ON ct.wasteentryid = we.id WHERE ct.userid = ? ORDER BY ct.createdat DESC LIMIT 50`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const payouts = await db.query(`SELECT id, coins, cashamount, paymentmethod, status, processedat, createdat FROM coin_payouts WHERE userid = ? ORDER BY createdat DESC`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    
    const coinValue = 0.01;
    const totalCoins = coins[0]?.totalcoins || 0;
    const lifetimeCoins = coins[0]?.lifetimecoins || 0;
    const paidAmount = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.cashamount || 0), 0);
    const pendingAmount = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.cashamount || 0), 0);
    
    res.json({
      success: true,
      coins: { total: totalCoins, lifetime: lifetimeCoins, cashValue: (totalCoins * coinValue).toFixed(2) },
      earnings: { totalEarnings: lifetimeCoins * coinValue, paidAmount, pendingAmount },
      payments: transactions.map(t => ({ 
        id: t.id, 
        wasteDate: t.wastedate || t.createdat,
        wasteType: t.wasteType || 'Unknown', 
        quantitySupplied: t.estimatedWeight || t.quantity || 0,
        unit: t.unit || 'kg',
        coinsEarned: Math.abs(t.amount), 
        totalAmount: Math.abs(t.amount) * coinValue,
        paymentStatus: 'completed',
        type: t.type,
        description: t.description
      }))
    });
  } catch (error) {
    console.error('Rewards error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/coins', auth, async (req, res) => {
  try {
    const coins = await db.query(`SELECT totalcoins, lifetimecoins, lastearned FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const transactions = await db.query(`SELECT id, amount, type, description, createdat FROM coin_transactions WHERE userid = ? ORDER BY createdat DESC LIMIT 20`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    
    const coinValue = 0.01;
    const totalCoins = coins[0]?.totalcoins || 0;
    
    res.json({
      success: true,
      coins: { 
        total: totalCoins, 
        lifetime: coins[0]?.lifetimecoins || 0, 
        cashValue: (totalCoins * coinValue).toFixed(2), 
        coinValue, 
        lastEarned: coins[0]?.lastearned 
      },
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: t.createdat,
        cashValue: (Math.abs(t.amount) * coinValue).toFixed(2)
      }))
    });
  } catch (error) {
    console.error('Coins error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/coins/convert', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: 'Minimum 100 coins required' });
    
    const coins = await db.query(`SELECT totalcoins FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    if (!coins[0] || coins[0].totalcoins < amount) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    
    await db.query(`UPDATE user_coins SET totalcoins = totalcoins - ?, updatedat = NOW() WHERE userid = ?`, { replacements: [amount, req.user.id], type: db.QueryTypes.UPDATE });
    
    const cashValue = (amount * 0.01).toFixed(2);
    await db.query(`INSERT INTO coin_transactions (userid, amount, type, description, createdat) VALUES (?, ?, 'converted', ?, NOW())`, { replacements: [req.user.id, -amount, `Converted ${amount} coins to $${cashValue}`], type: db.QueryTypes.INSERT });
    await db.query(`INSERT INTO coin_payouts (userid, coins, cashamount, paymentmethod, status, createdat) VALUES (?, ?, ?, ?, 'pending', NOW())`, { replacements: [req.user.id, amount, cashValue, paymentMethod || 'bank_transfer'], type: db.QueryTypes.INSERT });
    
    res.json({ success: true, message: 'Coins converted successfully', conversion: { coins: amount, cash: cashValue, paymentMethod: paymentMethod || 'bank_transfer', status: 'pending' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/request-payment', auth, async (req, res) => {
  try {
    const { paymentMethod, amount } = req.body;
    const coins = await db.query(`SELECT totalcoins FROM user_coins WHERE userid = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const totalCoins = coins[0]?.totalcoins || 0;
    const requestAmount = amount || totalCoins;
    
    if (requestAmount < 100) return res.status(400).json({ success: false, message: 'Minimum 100 coins required' });
    if (totalCoins < requestAmount) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    
    const cashAmount = (requestAmount * 0.01).toFixed(2);
    await db.query(`INSERT INTO coin_payouts (userid, coins, cashamount, paymentmethod, status, createdat) VALUES (?, ?, ?, ?, 'pending', NOW())`, { replacements: [req.user.id, requestAmount, cashAmount, paymentMethod || 'mobile_money'], type: db.QueryTypes.INSERT });
    res.json({ success: true, message: 'Payment request submitted', cashAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/leaderboard', auth, async (req, res) => {
  try {
    const leaderboard = await db.query(`SELECT u."firstName", u."lastName", u.organization, uc.totalcoins, uc.lifetimecoins FROM user_coins uc JOIN users u ON uc.userid = u.id WHERE u.role = 'supplier' AND u."isActive" = true ORDER BY uc.lifetimecoins DESC LIMIT 20`, { type: db.QueryTypes.SELECT });
    res.json({ success: true, leaderboard: leaderboard.map((user, index) => ({ rank: index + 1, name: `${user.firstName} ${user.lastName}`, organization: user.organization, coins: user.lifetimecoins })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/achievements', auth, async (req, res) => {
  res.json({ success: true, achievements: [], stats: { totalEntries: 0, totalWaste: 0, lifetimeCoins: 0, daysSinceJoined: 0 } });
});

module.exports = router;
