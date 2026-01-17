// routes/analyze.js
const express = require('express');
const router = express.Router();
const analytics = require('../services/analytics');

// Optional: Simple token-based auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

// Apply middleware to all routes
router.use(authMiddleware);

// Get dashboard data with optional filtering
router.get('/dashboard', async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await analytics.getDashboardData({ from, to });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// Export CSV with optional filters and limits
router.get('/csv', async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const csvData = await analytics.exportCSV({ from, to, limit });

    res.header('Content-Type', 'text/csv');
    res.attachment('analytics.csv');
    res.send(csvData);
  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ success: false, message: 'Failed to export CSV' });
  }
});

module.exports = router;