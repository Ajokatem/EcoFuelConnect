// Automated IoT Monitoring Service
const { IoTSensor, IoTSensorReading } = require('../models'); // Adjusted for Sequelize

/**
 
 */
async function monitorIoTSensors() {
  // Use Sequelize to fetch all sensors
  const sensors = await IoTSensor.findAll();
  const alerts = [];
  const now = new Date();

  for (const sensor of sensors) {
    // Find the latest reading for this deviceId using Sequelize
    const lastReadingDoc = await IoTSensorReading.findOne({
      where: { deviceId: sensor.deviceId },
      order: [['createdAt', 'DESC']]
    });
    // If readings is an array, get the last one
    const readingsArr = lastReadingDoc?.readings || [];
    const lastReading = readingsArr.length > 0 ? readingsArr[readingsArr.length - 1] : null;

    // Missing data alert (no reading in last 2 hours)
    if (!lastReading || (now - new Date(lastReading.timestamp)) > 2 * 60 * 60 * 1000) {
      alerts.push({
        deviceId: sensor.deviceId,
        type: 'missing_data',
        severity: 'high',
        message: 'No recent reading in last 2 hours.'
      });
    }

    // Sensor error status
    if (sensor.status === 'error') {
      alerts.push({
        deviceId: sensor.deviceId,
        type: 'sensor_error',
        severity: 'critical',
        message: 'Sensor is in error state.'
      });
    }

    // Abnormal value detection (example: out of range)
    if (lastReading && sensor.specifications?.measurementRange) {
      const { min, max } = sensor.specifications.measurementRange;
      if (lastReading.value < min || lastReading.value > max) {
        alerts.push({
          deviceId: sensor.deviceId,
          type: 'out_of_range',
          severity: 'medium',
          message: `Latest value ${lastReading.value} out of range (${min}-${max}).`
        });
      }
    }
  }

  return { alerts, checkedAt: now };
}

module.exports = { monitorIoTSensors };