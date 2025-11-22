const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User, WasteEntry, FuelRequest } = require('../models/index');
const BiogasProduction = require('../models/BiogasProduction');

// Conversion factor for CO2 reduction (example: 1kg biogas = 2.75kg CO2 saved)
const CO2_FACTOR = 2.75;

// GET /api/reports/waste-data - Get waste entries for reports
router.get('/waste-data', auth, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'supplier') {
      where.supplierId = req.user.id;
    } else if (req.user.role === 'producer') {
      where.producerId = req.user.id;
    }

    const wasteEntries = await WasteEntry.findAll({
      where,
      include: [
        { model: User, as: 'supplier', attributes: ['id', 'firstName', 'lastName', 'organization'] },
        { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization'] }
      ],
      order: [['collectionTimestamp', 'DESC']]
    });

    // Format data for frontend
    const formattedData = wasteEntries.map(entry => ({
      id: entry.id,
      date: entry.collectionTimestamp,
      type: entry.wasteType,
      quantity: entry.quantity || entry.estimatedWeight,
      location: entry.sourceLocation?.address || 'N/A',
      status: entry.status,
      estimatedFuelOutput: (parseFloat(entry.estimatedWeight || entry.quantity || 0) * 0.4).toFixed(2)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching waste data:', error);
    res.status(500).json({ success: false, message: 'Error fetching waste data' });
  }
});

// GET /api/reports/fuel-data - Get fuel requests for reports
router.get('/fuel-data', auth, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'school') {
      where.schoolId = req.user.id;
    } else if (req.user.role === 'producer') {
      where.producerId = req.user.id;
    }

    const fuelRequests = await FuelRequest.findAll({
      where,
      include: [
        { model: User, as: 'school', attributes: ['id', 'firstName', 'lastName', 'organization'] },
        { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization'] }
      ],
      order: [['requestDate', 'DESC']]
    });

    // Format data for frontend
    const formattedData = fuelRequests.map(request => ({
      id: request.id,
      trackingNumber: request.requestId || `FR-${request.id}`,
      dateRequested: request.requestDate,
      fuelType: request.fuelType,
      quantity: request.quantityRequested,
      status: request.status,
      estimatedCost: (parseFloat(request.quantityRequested || 0) * 1.5).toFixed(2),
      preferredDate: request.preferredDeliveryDate
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching fuel data:', error);
    res.status(500).json({ success: false, message: 'Error fetching fuel data' });
  }
});

// GET /api/reports/producer-summary
router.get('/producer-summary', auth, async (req, res) => {
  try {
    if (req.user.role !== 'producer') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const producerId = req.user.id;
    // Total waste processed (sum estimatedWeight for processed entries)
    const wasteEntries = await WasteEntry.findAll({ where: { producerId, status: 'processed' } });
    const totalWaste = wasteEntries.reduce((sum, entry) => sum + (parseFloat(entry.estimatedWeight) || 0), 0);
    // Total fuel generated (sum totalVolume for biogas production)
    const fuelEntries = await BiogasProduction.findAll({ where: { producerId } });
    const totalFuel = fuelEntries.reduce((sum, entry) => sum + (parseFloat(entry.totalVolume) || 0), 0);
    // Efficiency
    const efficiency = totalWaste > 0 ? (totalFuel / totalWaste) : 0;
    // CO2 reduced
    const co2Reduced = totalFuel * CO2_FACTOR;

    // Monthly breakdown for charts/tables
    const monthlyTrends = await BiogasProduction.getMonthlyTrends(producerId, new Date().getFullYear());
    // Format for frontend
    const monthly = monthlyTrends.map(row => ({
      month: row.get('month'),
      waste: parseFloat(row.get('feedstockUsed') || 0),
      fuel: parseFloat(row.get('monthlyProduction') || 0),
      efficiency: parseFloat(row.get('avgEfficiency') || 0)
    }));

    res.json({
      totalWaste,
      totalFuel,
      efficiency,
      co2Reduced,
      monthly
    });
  } catch (error) {
    console.error('Error fetching producer report:', error);
    res.status(500).json({ success: false, message: 'Error fetching report' });
  }
});

module.exports = router;
