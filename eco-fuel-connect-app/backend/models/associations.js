const User = require('./User');
const FuelRequest = require('./FuelRequest');
const BiogasProduction = require('./BiogasProduction');
const WasteEntry = require('./WasteEntry');
const Transaction = require('./Transaction');

// Define all model associations here
function defineAssociations() {
  // User associations
  if (User.associate) {
    User.associate({
      FuelRequest,
      BiogasProduction,
      WasteEntry,
      Transaction
    });
  }

  // FuelRequest associations
  if (FuelRequest.associate) {
    FuelRequest.associate({
      User,
      BiogasProduction,
      Transaction
    });
  }

  // BiogasProduction associations
  if (BiogasProduction.associate) {
    BiogasProduction.associate({
      User,
      FuelRequest,
      Transaction
    });
  }

  // WasteEntry associations
  if (WasteEntry.associate) {
    WasteEntry.associate({
      User
    });
  }

  // Transaction associations
  if (Transaction.associate) {
    Transaction.associate({
      User,
      FuelRequest,
      BiogasProduction
    });
  }
}

module.exports = { defineAssociations };