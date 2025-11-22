const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

router.get('/my-rewards', auth, async (req, res) => {
  try {
    const coins = await db.query(`SELECT "totalCoins", "lifetimeCoins" FROM user_coins WHERE "userId" = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const transactions = await db.query(`SELECT ct.id, ct.amount, ct.type, ct.description, ct."createdAt", we."wasteType", we.quantity, we.unit FROM coin_transactions ct LEFT JOIN waste_entries we ON ct."wasteEntryId" = we.id WHERE ct."userId" = ? ORDER BY ct."createdAt" DESC LIMIT 50`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const payouts = await db.query(`SELECT id, coins, "cashAmount", "paymentMethod", status, "processedAt", "createdAt" FROM coin_payouts WHERE "userId" = ? ORDER BY "createdAt" DESC`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    
    const coinValue = 0.01;
    const totalCoins = coins[0]?.totalCoins || 0;
    const lifetimeCoins = coins[0]?.lifetimeCoins || 0;
    const paidAmount = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.cashAmount || 0), 0);
    const pendingAmount = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.cashAmount || 0), 0);
    
    res.json({
      success: true,
      coins: { total: totalCoins, lifetime: lifetimeCoins, cashValue: (totalCoins * coinValue).toFixed(2) },
      earnings: { totalEarnings: (lifetimeCoins * coinValue).toFixed(2), paidAmount: paidAmount.toFixed(2), pendingAmount: pendingAmount.toFixed(2) },
      transactions: transactions.map(t => ({ 
        id: t.id, 
        date: t.createdAt, 
        wasteType: t.wasteType, 
        quantity: t.quantity, 
        unit: t.unit,
        coinsEarned: Math.abs(t.amount), 
        cashValue: (Math.abs(t.amount) * coinValue).toFixed(2),
        type: t.type,
        description: t.description
      })),
      payouts: payouts.map(p => ({
        id: p.id,
        coins: p.coins,
        amount: parseFloat(p.cashAmount).toFixed(2),
        method: p.paymentMethod,
        status: p.status,
        requestedAt: p.createdAt,
        processedAt: p.processedAt
      }))
    });
  } catch (error) {
    console.error('Rewards error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/coins', auth, async (req, res) => {
  try {
    const coins = await db.query(`SELECT "totalCoins", "lifetimeCoins", "lastEarned" FROM user_coins WHERE "userId" = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const transactions = await db.query(`SELECT id, amount, type, description, "createdAt" FROM coin_transactions WHERE "userId" = ? ORDER BY "createdAt" DESC LIMIT 20`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    
    const coinValue = 0.01;
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
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: t.createdAt,
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
    const { paymentMethod, paymentDetails, amount } = req.body;
    
    if (!paymentMethod) return res.status(400).json({ success: false, message: 'Payment method required' });
    if (!paymentDetails) return res.status(400).json({ success: false, message: 'Payment details required' });
    
    const coins = await db.query(`SELECT "totalCoins" FROM user_coins WHERE "userId" = ?`, { replacements: [req.user.id], type: db.QueryTypes.SELECT });
    const totalCoins = coins[0]?.totalCoins || 0;
    const requestAmount = amount || totalCoins;
    const cashAmount = requestAmount * 0.01;
    
    if (cashAmount < 50) return res.status(400).json({ success: false, message: 'Minimum $50 required for payout' });
    if (totalCoins < requestAmount) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    
    await db.query(`UPDATE user_coins SET "totalCoins" = "totalCoins" - ?, "updatedAt" = NOW() WHERE "userId" = ?`, { replacements: [requestAmount, req.user.id], type: db.QueryTypes.UPDATE });
    await db.query(`INSERT INTO coin_transactions ("userId", amount, type, description, "createdAt") VALUES (?, ?, 'withdrawal', ?, NOW())`, { replacements: [req.user.id, -requestAmount, `Payment request: $${cashAmount.toFixed(2)}`], type: db.QueryTypes.INSERT });
    
    const result = await db.query(`INSERT INTO coin_payouts ("userId", coins, "cashAmount", "paymentMethod", "paymentDetails", status, "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW()) RETURNING id`, { replacements: [req.user.id, requestAmount, cashAmount.toFixed(2), paymentMethod, JSON.stringify(paymentDetails)], type: db.QueryTypes.INSERT });
    
    const Notification = require('../models/Notification');
    const User = require('../models/User');
    const producers = await User.findAll({ where: { role: 'producer', isActive: true } });
    for (const producer of producers) {
      await Notification.create({
        userId: producer.id,
        type: 'payment_request',
        title: 'New Payment Request',
        message: `Supplier ${req.user.firstName} ${req.user.lastName} requested payout of $${cashAmount.toFixed(2)}`,
        isRead: false
      });
    }
    
    res.json({ success: true, message: 'Payment request submitted successfully', payoutId: result[0]?.id, amount: cashAmount.toFixed(2) });
  } catch (error) {
    console.error('Payment request error:', error.message);
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

router.get('/pending-payouts', auth, async (req, res) => {
  try {
    if (req.user.role !== 'producer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const payouts = await db.query(`
      SELECT cp.id, cp.coins, cp."cashAmount", cp."paymentMethod", cp."paymentDetails", cp.status, cp."createdAt",
             u.id as "userId", u."firstName", u."lastName", u.email, u.phone, u.organization
      FROM coin_payouts cp
      JOIN users u ON cp."userId" = u.id
      WHERE cp.status = 'pending'
      ORDER BY cp."createdAt" DESC
    `, { type: db.QueryTypes.SELECT });
    
    res.json({ success: true, payouts });
  } catch (error) {
    console.error('Pending payouts error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/process-payment/:payoutId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'producer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only producers can process payments' });
    }
    
    const { payoutId } = req.params;
    const { transactionReference, notes } = req.body;
    
    const payout = await db.query(`SELECT * FROM coin_payouts WHERE id = ?`, { replacements: [payoutId], type: db.QueryTypes.SELECT });
    if (!payout[0]) return res.status(404).json({ success: false, message: 'Payout not found' });
    if (payout[0].status !== 'pending') return res.status(400).json({ success: false, message: 'Payout already processed' });
    
    await db.query(`UPDATE coin_payouts SET status = 'completed', "processedAt" = NOW(), "processedBy" = ?, "transactionReference" = ?, notes = ?, "updatedAt" = NOW() WHERE id = ?`, { replacements: [req.user.id, transactionReference, notes, payoutId], type: db.QueryTypes.UPDATE });
    
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: payout[0].userId,
      type: 'payment_completed',
      title: 'Payment Processed',
      message: `Your payment of $${payout[0].cashAmount} has been processed successfully`,
      isRead: false
    });
    
    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Process payment error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
