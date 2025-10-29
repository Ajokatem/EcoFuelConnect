const sequelize = require('sequelize');

// IoT Sensor Device Schema
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class IoTSensorReading extends Model {
    getLatestReading() {
      if (!this.readings || this.readings.length === 0) return null;
      return this.readings.reduce((latest, r) => new Date(r.timestamp) > new Date(latest.timestamp) ? r : latest, this.readings[0]);
    }
  }

  IoTSensorReading.init({
    deviceId: { type: DataTypes.STRING, allowNull: false, index: true },
    sensorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'IoTSensors', key: 'id' }},
    readings: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // array of readings with timestamp, value, unit, quality, flags
    metadata: DataTypes.JSON, // batteryLevel, signalStrength, location, etc.
    processingInfo: DataTypes.JSON, // validationStatus, anomalies, etc.
    aggregationData: DataTypes.JSON, // hourlyAverage, min, max, trends
    alerts: DataTypes.JSON, // alerts linked to the reading
  }, {
    sequelize,
    modelName: 'IoTSensorReading',
    tableName: 'iot_sensor_readings',
    timestamps: true,
    indexes: [{ fields: ['deviceId'] }, { fields: ['sensorId'] }]
  });

  return IoTSensorReading;
};
