const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Image analysis API placeholder' });
});

router.post('/estimate-weight', async (req, res) => {
  try {
    const { imageData, wasteType } = req.body;
    
    // Simple estimation based on waste type
    const estimations = {
      'food_waste': { min: 2, max: 5, unit: 'kg' },
      'garden_waste': { min: 5, max: 15, unit: 'kg' },
      'paper': { min: 1, max: 3, unit: 'kg' },
      'mixed': { min: 3, max: 8, unit: 'kg' }
    };
    
    const estimate = estimations[wasteType] || estimations['mixed'];
    const estimatedWeight = (estimate.min + estimate.max) / 2;
    
    res.json({
      success: true,
      estimatedWeight,
      unit: estimate.unit,
      confidence: 0.75,
      range: { min: estimate.min, max: estimate.max }
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
});

module.exports = router;
