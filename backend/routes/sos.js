// routes/sos.js
const express = require('express');
const router = express.Router();
const memoryStore = require('../db/memoryStore');
const sosService = require('../services/sosService');

// Create new SOS session
router.post('/create', async (req, res) => {
  const { userId, location, severity } = req.body;
  const session = sosService.createSOSSession(userId, location, severity);
  res.json(session);
});

// Update SOS session (status, helpers, etc.)
router.post('/update', async (req, res) => {
  const { sessionId, updates } = req.body;
  const updated = sosService.updateSOSSession(sessionId, updates);
  res.json(updated);
});

// Get live location
router.get('/track/:userId', (req, res) => {
  const { userId } = req.params;
  const location = memoryStore.getLiveLocation(userId);
  res.json(location);
});

// Resolve SOS
router.post('/resolve/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const resolved = sosService.resolveSOSSession(sessionId);
  res.json(resolved);
});

// Assign helper
router.post('/helpers/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { helperId } = req.body;
  const updated = memoryStore.addHelperToSession(sessionId, helperId);
  res.json(updated);
});

module.exports = router;