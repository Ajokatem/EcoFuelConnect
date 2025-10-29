const WasteEntry = require('../models/WasteEntry');
const User = require('../models/User');
const { Op } = require('sequelize');

class WasteService {
  // Create new waste entry
  async createWasteEntry(userId, wasteData) {
    const wasteEntry = await WasteEntry.create({
      ...wasteData,
      userId,
      entryDate: wasteData.entryDate || new Date()
    });

    return wasteEntry;
  }

  // Get waste entries with pagination and filters
  async getWasteEntries(userId, filters = {}) {
    const where = { userId };

    // Add date range filter
    if (filters.startDate && filters.endDate) {
      where.entryDate = {
        [Op.between]: [filters.startDate, filters.endDate]
      };
    }

    // Add waste type filter
    if (filters.wasteType) {
      where.wasteType = filters.wasteType;
    }

    // Add source filter
    if (filters.source) {
      where.source = {
        [Op.iLike]: `%${filters.source}%`
      };
    }

    const options = {
      where,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['entryDate', 'DESC']],
      limit: filters.limit || 10,
      offset: filters.offset || 0
    };

    const { rows: wasteEntries, count } = await WasteEntry.findAndCountAll(options);

    return {
      wasteEntries,
      totalCount: count,
      currentPage: Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1,
      totalPages: Math.ceil(count / (filters.limit || 10))
    };
  }

  // Get specific waste entry
  async getWasteEntry(id, userId) {
    const wasteEntry = await WasteEntry.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    if (!wasteEntry) {
      throw new Error('Waste entry not found');
    }

    return wasteEntry;
  }

  // Update waste entry
  async updateWasteEntry(id, userId, updateData) {
    const wasteEntry = await WasteEntry.findOne({
      where: { id, userId }
    });

    if (!wasteEntry) {
      throw new Error('Waste entry not found');
    }

    await wasteEntry.update(updateData);
    return wasteEntry;
  }

  // Delete waste entry
  async deleteWasteEntry(id, userId) {
    const wasteEntry = await WasteEntry.findOne({
      where: { id, userId }
    });

    if (!wasteEntry) {
      throw new Error('Waste entry not found');
    }

    await wasteEntry.destroy();
    return { message: 'Waste entry deleted successfully' };
  }

  // Get waste analytics
  async getWasteAnalytics(userId, timeframe = '30d') {
    const endDate = new Date();
    const startDate = new Date();

    // Set start date based on timeframe
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get total waste statistics
    const totalWaste = await WasteEntry.sum('quantity', {
      where: {
        userId,
        entryDate: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Get waste by type
    const wasteByType = await WasteEntry.findAll({
      where: {
        userId,
        entryDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'wasteType',
        [WasteEntry.sequelize.fn('SUM', WasteEntry.sequelize.col('quantity')), 'totalQuantity'],
        [WasteEntry.sequelize.fn('COUNT', WasteEntry.sequelize.col('id')), 'entryCount']
      ],
      group: ['wasteType'],
      order: [[WasteEntry.sequelize.fn('SUM', WasteEntry.sequelize.col('quantity')), 'DESC']]
    });

    // Get daily waste trend
    const dailyTrend = await WasteEntry.findAll({
      where: {
        userId,
        entryDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [WasteEntry.sequelize.fn('DATE', WasteEntry.sequelize.col('entryDate')), 'date'],
        [WasteEntry.sequelize.fn('SUM', WasteEntry.sequelize.col('quantity')), 'totalQuantity']
      ],
      group: [WasteEntry.sequelize.fn('DATE', WasteEntry.sequelize.col('entryDate'))],
      order: [[WasteEntry.sequelize.fn('DATE', WasteEntry.sequelize.col('entryDate')), 'ASC']]
    });

    return {
      totalWaste: totalWaste || 0,
      wasteByType,
      dailyTrend,
      timeframe,
      period: {
        startDate,
        endDate
      }
    };
  }
}

module.exports = new WasteService();