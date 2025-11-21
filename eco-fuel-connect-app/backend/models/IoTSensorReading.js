const sequelize = require('sequelize');

// IoT Sensor Reading Schema
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class IoTSensor extends Model {
    get calibrationStatus() {
      // calculate calibration status based on dates
    }
    get maintenanceStatus() {
      // similar for maintenance
    }
    get connectivityStatus() {
      // calculate connectivity status
    }
  }

  IoTSensor.init({
    deviceId: { type: DataTypes.STRING, allowNull: false, unique: true },
    deviceType: { type: DataTypes.ENUM('temperature_sensor', 'ph_sensor', 'gas_flow_sensor', 'pressure_sensor', 'moisture_sensor', 'level_sensor', 'gas_composition_sensor'), allowNull: false },
    status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'error'), defaultValue: 'active' },
    location: DataTypes.JSON, // includes digesterId, position, coords, description
    specifications: DataTypes.JSON, // manufacturer, model, accuracy, etc.
    calibration: DataTypes.JSON, // lastCalibrated, intervals, history
    configuration: DataTypes.JSON, // readingInterval, alertsEnabled, etc.
    connectivity: DataTypes.JSON, // lastSeen, batteryLevel, firmwareVersion
    maintenance: DataTypes.JSON, // installationDate, maintenanceHistory, etc.
    ownerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }},
    assignedProjectId: { type: DataTypes.INTEGER, references: { model: 'projects', key: 'id' }}
  }, {
    sequelize,
    modelName: 'IoTSensor',
    tableName: 'iot_sensors',
    timestamps: true
  });

  return IoTSensor;
};
