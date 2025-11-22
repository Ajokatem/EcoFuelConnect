const { sequelize } = require('../config/database');

async function awardRetroactiveCoins() {
  try {
    console.log('🪙 Starting retroactive coin awards...');
    
    // Get all waste entries that don't have coin transactions
    const wasteEntries = await sequelize.query(`
      SELECT we.id, we."supplierId", we."estimatedWeight", we."qualityGrade"
      FROM waste_entries we
      WHERE NOT EXISTS (
        SELECT 1 FROM coin_transactions ct 
        WHERE ct.wasteentryid = we.id
      )
      ORDER BY we."createdAt" ASC
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log(`🪙 Found ${wasteEntries.length} waste entries without coin rewards`);
    
    if (wasteEntries.length === 0) {
      console.log('✅ No retroactive coins needed');
      return;
    }
    
    const qualityMultipliers = {
      'excellent': 1.5,
      'good': 1.2,
      'fair': 1.0,
      'poor': 0.8
    };
    
    for (const entry of wasteEntries) {
      const estimatedWeight = parseFloat(entry.estimatedWeight) || 0;
      if (estimatedWeight <= 0) continue;
      
      // Calculate coins: 0.5 coins per kg * quality multiplier
      let coinsEarned = Math.floor(estimatedWeight * 0.5);
      const multiplier = qualityMultipliers[entry.qualityGrade] || 1.0;
      coinsEarned = Math.floor(coinsEarned * multiplier);
      
      if (coinsEarned <= 0) continue;
      
      // Check if user_coins record exists
      const existingCoins = await sequelize.query(
        'SELECT totalcoins FROM user_coins WHERE userid = ?',
        { replacements: [entry.supplierId], type: sequelize.QueryTypes.SELECT }
      );
      
      if (existingCoins.length > 0) {
        // Update existing
        await sequelize.query(
          'UPDATE user_coins SET totalcoins = totalcoins + ?, lifetimecoins = lifetimecoins + ?, updatedat = NOW() WHERE userid = ?',
          { replacements: [coinsEarned, coinsEarned, entry.supplierId], type: sequelize.QueryTypes.UPDATE }
        );
      } else {
        // Create new
        await sequelize.query(
          'INSERT INTO user_coins (userid, totalcoins, lifetimecoins, createdat, updatedat) VALUES (?, ?, ?, NOW(), NOW())',
          { replacements: [entry.supplierId, coinsEarned, coinsEarned], type: sequelize.QueryTypes.INSERT }
        );
      }
      
      // Log transaction
      await sequelize.query(
        'INSERT INTO coin_transactions (userid, amount, type, description, wasteentryid, createdat) VALUES (?, ?, ?, ?, ?, NOW())',
        { 
          replacements: [
            entry.supplierId, 
            coinsEarned, 
            'earned', 
            `Retroactive reward: ${coinsEarned} coins for ${Math.round(estimatedWeight)}kg waste`,
            entry.id
          ], 
          type: sequelize.QueryTypes.INSERT 
        }
      );
      
      console.log(`✅ Awarded ${coinsEarned} coins to user ${entry.supplierId} for waste entry ${entry.id}`);
    }
    
    console.log('✅ Retroactive coin awards completed');
  } catch (error) {
    console.error('❌ Retroactive coin award error:', error.message);
    throw error;
  }
}

module.exports = { awardRetroactiveCoins };

if (require.main === module) {
  awardRetroactiveCoins()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
