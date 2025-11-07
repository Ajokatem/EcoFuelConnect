const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

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
