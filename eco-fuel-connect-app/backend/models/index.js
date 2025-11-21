const User = require('./User');
const WasteEntry = require('./WasteEntry');

// Set up associations
WasteEntry.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });
WasteEntry.belongsTo(User, { foreignKey: 'producerId', as: 'producer' });
WasteEntry.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifiedBy' });

User.hasMany(WasteEntry, { foreignKey: 'supplierId', as: 'suppliedWaste' });
User.hasMany(WasteEntry, { foreignKey: 'producerId', as: 'receivedWaste' });

module.exports = { User, WasteEntry };
