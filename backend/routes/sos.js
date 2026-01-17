// routes/sos.js
const express = require('express');
const router = express.Router();

const memoryStore = require('../db/memoryStore');
const sosService = require('../services/sosService');

/* ===============================
   OPTIONAL AUTH MIDDLEWARE
   =============================== */
// Uncomment when you enable auth
// const authMiddleware = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token || token !== process.env.USER_TOKEN) {
//     return res.status(403).json({
//       success: false,
//       message: 'Unauthorized access'
//     });
//   }
//   next();
// };
// router.use(authMiddleware);

/* ===============================
   HELPERS
   =============================== */
const validateFields = (requiredFields, body) => {
  for (const field of requiredFields) {
    if (!body[field]) return `Missing field: ${field}`;
  }
  return null;
};

/* ===============================
   CREATE SOS SESSION
   =============================== */
router.post('/create', async (req, res) => {
  try {
    const error = validateFields(['userId', 'location', 'severity'], req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { userId, location, severity } = req.body;
    const session = sosService.createSOSSession(userId, location, severity);

    return res.status(201).json({
      success: true,
      data: session,
      message: 'SOS session created successfully'
    });
  } catch (err) {
    console.error('Create SOS Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create SOS session'
    });
  }
});

/* ===============================
   UPDATE SOS SESSION
   =============================== */
router.post('/update', async (req, res) => {
  try {
    const error = validateFields(['sessionId', 'updates'], req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { sessionId, updates } = req.body;
    const updatedSession = sosService.updateSOSSession(sessionId, updates);

    return res.json({
      success: true,
      data: updatedSession,
      message: 'SOS session updated'
    });
  } catch (err) {
    console.error('Update SOS Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update SOS session'
    });
  }
});

/* ===============================
   GET LIVE LOCATION
   =============================== */
router.get('/track/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const location = memoryStore.getLiveLocation(userId);

    return res.json({
      success: true,
      data: location || {},
      message: 'Live location fetched'
    });
  } catch (err) {
    console.error('Track Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch live location'
    });
  }
});

/* ===============================
   RESOLVE SOS
   =============================== */
router.post('/resolve/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const resolvedSession = sosService.resolveSOSSession(sessionId);

    return res.json({
      success: true,
      data: resolvedSession,
      message: 'SOS session resolved'
    });
  } catch (err) {
    console.error('Resolve Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve SOS session'
    });
  }
});

/* ===============================
   ASSIGN HELPER
   =============================== */
router.post('/helpers/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { helperId } = req.body;

    if (!helperId) {
      return res.status(400).json({
        success: false,
        message: 'Missing helperId'
      });
    }

    const updatedSession = memoryStore.addHelperToSession(sessionId, helperId);

    return res.json({
      success: true,
      data: updatedSession,
      message: 'Helper assigned successfully'
    });
  } catch (err) {
    console.error('Assign Helper Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign helper'
    });
  }
});

/* ===============================
   REMOVE HELPER
   =============================== */
router.delete('/helpers/:sessionId/:helperId', async (req, res) => {
  try {
    const { sessionId, helperId } = req.params;
    const updatedSession = memoryStore.removeHelperFromSession(sessionId, helperId);

    return res.json({
      success: true,
      data: updatedSession,
      message: 'Helper removed successfully'
    });
  } catch (err) {
    console.error('Remove Helper Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove helper'
    });
  }
});

/* ===============================
   GET ALL ACTIVE SOS SESSIONS
   =============================== */
router.get('/active', async (req, res) => {
  try {
    const sessions = Object.values(memoryStore.sosSessions || {})
      .filter(session => session.status !== 'resolved');

    return res.json({
      success: true,
      data: sessions,
      message: 'Active SOS sessions fetched'
    });
  } catch (err) {
    console.error('Fetch Active SOS Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active SOS sessions'
    });
  }
});

module.exports = router;