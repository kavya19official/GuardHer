// routes/sos.js
const express = require('express');
const router = express.Router();
const memoryStore = require('../db/memoryStore');
const sosService = require('../services/sosService');

// Optional: authentication middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token || token !== process.env.USER_TOKEN) {
//     return res.status(403).json({ success: false, message: 'Forbidden' });
//   }
//   next();
// };
// router.use(authMiddleware);

// Helper to validate required fields
const validateFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) return `Missing field: ${field}`;
  }
  return null;
};

// Create new SOS session
router.post('/create', async (req, res) => {
  try {
    const err = validateFields(['userId', 'location', 'severity'], req.body);
    if (err) return res.status(400).json({ success: false, message: err });

    const { userId, location, severity } = req.body;
    const session = sosService.createSOSSession(userId, location, severity);
    res.json({ success: true, data: session, message: 'SOS session created' });
  } catch (error) {
    console.error('Create SOS Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create SOS session' });
  }
});

// Update SOS session (status, helpers, etc.)
router.post('/update', async (req, res) => {
  try {
    const err = validateFields(['sessionId', 'updates'], req.body);
    if (err) return res.status(400).json({ success: false, message: err });

    const { sessionId, updates } = req.body;
    const updated = sosService.updateSOSSession(sessionId, updates);
    res.json({ success: true, data: updated, message: 'SOS session updated' });
  } catch (error) {
    console.error('Update SOS Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update SOS session' });
  }
});

// Get live location
router.get('/track/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const location = memoryStore.getLiveLocation(userId);
    res.json({ success: true, data: location || {}, message: 'Live location fetched' });
  } catch (error) {
    console.error('Track Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get live location' });
  }
});

// Resolve SOS
router.post('/resolve/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const resolved = sosService.resolveSOSSession(sessionId);
    res.json({ success: true, data: resolved, message: 'SOS session resolved' });
  } catch (error) {
    console.error('Resolve Error:', error);
    res.status(500).json({ success: false, message: 'Failed to resolve SOS session' });
  }
});

// Assign helper
router.post('/helpers/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { helperId } = req.body;
    if (!helperId) return res.status(400).json({ success: false, message: 'Missing helperId' });

    const updated = memoryStore.addHelperToSession(sessionId, helperId);
    res.json({ success: true, data: updated, message: 'Helper assigned' });
  } catch (error) {
    console.error('Assign Helper Error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign helper' });
  }
});

// Remove helper
router.delete('/helpers/:sessionId/:helperId', (req, res) => {
  try {
    const { sessionId, helperId } = req.params;
    const updated = memoryStore.removeHelperFromSession(sessionId, helperId);
    res.json({ success: true, data: updated, message: 'Helper removed' });
  } catch (error) {
    console.error('Remove Helper Error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove helper' });
  }
});

// Get all active SOS sessions
router.get('/active', (req, res) => {
  try {
    const sessions = Object.values(memoryStore.sosSessions).filter(s => s.status !== 'resolved');
    res.json({ success: true, data: sessions, message: 'Active SOS sessions fetched' });
  } catch (error) {
    console.error('Active SOS Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch active sessions' });
  }
});

module.exports = router;
