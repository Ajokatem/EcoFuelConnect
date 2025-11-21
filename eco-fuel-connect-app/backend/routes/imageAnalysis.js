const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Image analysis API placeholder' });
});

module.exports = router;
