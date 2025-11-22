const User = require('./User');
const WasteEntry = require('./WasteEntry');
const FuelRequest = require('./FuelRequest');

// Set up associations
WasteEntry.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });
WasteEntry.belongsTo(User, { foreignKey: 'producerId', as: 'producer' });
WasteEntry.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });

User.hasMany(WasteEntry, { foreignKey: 'supplierId', as: 'suppliedWaste' });
User.hasMany(WasteEntry, { foreignKey: 'producerId', as: 'receivedWaste' });

// FuelRequest associations
FuelRequest.belongsTo(User, { foreignKey: 'schoolId', as: 'school' });
FuelRequest.belongsTo(User, { foreignKey: 'producerId', as: 'producer' });

User.hasMany(FuelRequest, { foreignKey: 'schoolId', as: 'fuelRequestsAsSchool' });
User.hasMany(FuelRequest, { foreignKey: 'producerId', as: 'fuelRequestsAsProducer' });

module.exports = { User, WasteEntry, FuelRequest };
