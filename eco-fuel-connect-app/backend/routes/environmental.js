const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WasteEntry = require('../models/WasteEntry');
const BiogasProduction = require('../models/BiogasProduction');
const { fn, col } = require('sequelize');

// GET /api/environmental/carbon-calculations
// Detailed carbon offset calculations with methodology
router.get('/carbon-calculations', auth, async (req, res) => {
  try {
    // Get total waste processed
    const totalWasteResult = await WasteEntry.findAll({
      attributes: [[fn('SUM', col('estimatedWeight')), 'total']]
    });
    const totalWaste = parseFloat(totalWasteResult[0]?.getDataValue('total') || 0);

    // Get biogas production data
    const totalBiogasResult = await BiogasProduction.findAll({
      attributes: [[fn('SUM', col('totalVolume')), 'total']]
    });
    const totalBiogas = parseFloat(totalBiogasResult[0]?.getDataValue('total') || 0);

    // Carbon calculation methodology
    const calculations = {
      methodology: {
        description: "Carbon offset calculations based on IPCC guidelines and biogas industry standards",
        sources: [
          "IPCC 2019 Refinement to the 2006 IPCC Guidelines",
          "EPA Methane Emissions from Landfills",
          "Biogas Carbon Footprint Analysis"
        ]
      },
      wasteToCarbon: {
        totalWasteKg: totalWaste,
        // Organic waste decomposition produces ~0.5 kg CO2 equivalent per kg
        decompositionFactor: 0.5,
        // Methane has 25x global warming potential of CO2
        methaneFactor: 25,
        // Avoided emissions from preventing landfill decomposition
        avoidedEmissions: totalWaste * 0.5 * 25,
        unit: "kg CO2 equivalent"
      },
      biogasToCarbon: {
        totalBiogasCubicMeters: totalBiogas,
        // 1 cubic meter biogas = ~6 kWh energy
        energyContent: totalBiogas * 6,
        // Replaces fossil fuel: 1 kWh from fossil = ~0.5 kg CO2
        fossilFuelReplacement: totalBiogas * 6 * 0.5,
        unit: "kg CO2 equivalent"
      },
      totalCarbonOffset: {
        avoidedLandfillEmissions: totalWaste * 0.5 * 25,
        replacedFossilFuels: totalBiogas * 6 * 0.5,
        total: (totalWaste * 0.5 * 25) + (totalBiogas * 6 * 0.5),
        unit: "kg CO2 equivalent"
      },
      equivalents: {
        treesPlanted: Math.floor(((totalWaste * 0.5 * 25) + (totalBiogas * 6 * 0.5)) / 22),
        carsOffRoad: Math.floor(((totalWaste * 0.5 * 25) + (totalBiogas * 6 * 0.5)) / 4600),
        householdsPowered: Math.floor((totalBiogas * 6) / 10950) // Average household uses 30 kWh/day
      },
      realTimeFactors: {
        wasteDecompositionRate: "0.5 kg CO2eq per kg organic waste",
        biogasEnergyContent: "6 kWh per cubic meter",
        fossilFuelEmissionFactor: "0.5 kg CO2 per kWh",
        treeAbsorptionRate: "22 kg CO2 per tree per year",
        lastUpdated: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      message: "Carbon offset calculations retrieved with full methodology",
      calculations,
      summary: {
        totalCarbonOffset: calculations.totalCarbonOffset.total,
        treesEquivalent: calculations.equivalents.treesPlanted,
        carsOffRoadEquivalent: calculations.equivalents.carsOffRoad,
        householdsPoweredEquivalent: calculations.equivalents.householdsPowered
      }
    });

  } catch (error) {
    console.error('Carbon calculations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating carbon offsets'
    });
  }
});

// GET /api/environmental/impact-metrics
// Real-time environmental impact metrics
router.get('/impact-metrics', auth, async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;
    
    let dateFilter = {};
    if (timeframe !== 'all') {
      const now = new Date();
      switch (timeframe) {
        case 'today':
          dateFilter.createdAt = {
            [require('sequelize').Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          };
          break;
        case 'week':
          dateFilter.createdAt = {
            [require('sequelize').Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          };
          break;
        case 'month':
          dateFilter.createdAt = {
            [require('sequelize').Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
          };
          break;
      }
    }

    // Get waste data for timeframe
    const wasteData = await WasteEntry.findAll({
      where: dateFilter,
      attributes: [
        [fn('SUM', col('estimatedWeight')), 'totalWaste'],
        [fn('COUNT', '*'), 'totalEntries']
      ]
    });

    const totalWaste = parseFloat(wasteData[0]?.getDataValue('totalWaste') || 0);
    const totalEntries = parseInt(wasteData[0]?.getDataValue('totalEntries') || 0);

    // Calculate real-time metrics
    const metrics = {
      timeframe,
      wasteMetrics: {
        totalProcessed: totalWaste,
        totalEntries,
        averagePerEntry: totalEntries > 0 ? (totalWaste / totalEntries).toFixed(2) : 0,
        unit: 'kg'
      },
      environmentalImpact: {
        carbonOffset: (totalWaste * 2.3).toFixed(2),
        methaneReduced: (totalWaste * 0.5).toFixed(2),
        energyGenerated: (totalWaste * 1.5).toFixed(2),
        units: {
          carbon: 'kg CO2 equivalent',
          methane: 'kg CH4',
          energy: 'kWh'
        }
      },
      socialImpact: {
        treesEquivalent: Math.floor((totalWaste * 2.3) / 22),
        carsOffRoad: Math.floor((totalWaste * 2.3) / 4600),
        householdsDays: Math.floor((totalWaste * 1.5) / 30)
      },
      economicImpact: {
        fuelValueGenerated: (totalWaste * 1.5 * 0.15).toFixed(2), // $0.15 per kWh
        wasteDisposalSaved: (totalWaste * 0.05).toFixed(2), // $0.05 per kg disposal cost
        totalEconomicValue: ((totalWaste * 1.5 * 0.15) + (totalWaste * 0.05)).toFixed(2),
        currency: 'USD'
      },
      lastCalculated: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Environmental impact metrics for ${timeframe}`,
      metrics
    });

  } catch (error) {
    console.error('Impact metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating impact metrics'
    });
  }
});

module.exports = router;
