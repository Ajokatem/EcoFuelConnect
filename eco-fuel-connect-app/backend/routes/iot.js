const express = require('express');
const router = express.Router();
const IoTSensor = require('../models/IoTSensor');
const IoTSensorReading = require('../models/IoTSensorReading');
// If you have an IoTAlert model, import it here:
// const IoTAlert = require('../models/IoTAlert');
const { auth, authorize } = require('../middleware/auth');

// List all sensors with pagination/filtering
router.get('/sensors', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, deviceType, status, search } = req.query;
    const where = {};
    if (deviceType) where.deviceType = deviceType;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { deviceId: { [Op.like]: `%${search}%` } },
        { '$specifications.manufacturer$': { [Op.like]: `%${search}%` } }
      ];
    }
    const sensors = await IoTSensor.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    res.json({
      sensors: sensors.rows,
      pagination: {
        total: sensors.count,
        page: parseInt(page),
        pages: Math.ceil(sensors.count / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sensors', error: error.message });
  }
});

// Other routes similarly restructured...

module.exports = router;
