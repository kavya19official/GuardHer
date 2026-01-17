// backend/services/sosService.js

const memoryStore = require('../db/memoryStore');
const evidenceStore = require('../db/evidencestore');
const { v4: uuidv4 } = require('uuid');

class SOSService {
  // Create a new SOS session
  createSOSSession(userId, location, severity) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId,
      status: 'active',
      severity,          // e.g., 'low', 'medium', 'high'
      location,
      helpers: [],
      createdAt: new Date()
    };

    memoryStore.addSession(sessionId, session);

    // Trigger severity-based actions
    this.handleSeverity(session);

    return session;
  }

  // Update session info (status, location, etc.)
  updateSOSSession(sessionId, updates) {
    const session = memoryStore.updateSession(sessionId, updates);
    if (!session) return null;

    // Update live location if provided
    if (updates.location) {
      memoryStore.updateLiveLocation(session.userId, updates.location.lat, updates.location.lng);
    }

    return session;
  }

  // Resolve a session
  resolveSOSSession(sessionId) {
    const session = memoryStore.updateSession(sessionId, { status: 'resolved' });
    if (!session) return null;

    // Optional: Remove live tracking
    memoryStore.deleteLiveLocation(session.userId);

    console.log(`SOS session ${sessionId} resolved for user ${session.userId}`);
    return session;
  }

  // Assign a trusted helper to a session
  assignHelper(sessionId, helperId) {
    const session = memoryStore.addHelperToSession(sessionId, helperId);
    if (!session) return null;

    // Simulate sending notification to helper
    this.notifyHelper(helperId, session);

    return session;
  }

  // Remove a helper from a session
  removeHelper(sessionId, helperId) {
    return memoryStore.removeHelperFromSession(sessionId, helperId);
  }

  // Handle severity-based actions
  handleSeverity(session) {
    switch (session.severity) {
      case 'low':
        console.log(`Low severity SOS: notify user only.`);
        break;
      case 'medium':
        console.log(`Medium severity SOS: notify user and helpline.`);
        this.callHelpline(session.userId);
        break;
      case 'high':
        console.log(`High severity SOS: notify user, helpline, and authorities.`);
        this.callHelpline(session.userId);
        this.notifyAuthorities(session);
        break;
      default:
        console.log(`Unknown severity level.`);
    }
  }

  // Simulate calling helpline
  callHelpline(userId) {
    console.log(`Calling helpline for user ${userId}...`);
  }

  // Simulate notifying authorities
  notifyAuthorities(session) {
    console.log(`Notifying authorities for SOS ${session.id}, user ${session.userId}`);
  }

  // Simulate sending WhatsApp/Telegram notification to helper
  notifyHelper(helperId, session) {
    console.log(`Notifying helper ${helperId} for SOS ${session.id}`);
  }

  // Add evidence to the evidence locker
  async addEvidence(userId, type, data) {
    return await evidenceStore.addEvidence(userId, type, data);
  }

  // Get evidence for a user
  async getEvidence(userId) {
    return await evidenceStore.getEvidenceByUser(userId);
  }

  // Get all active sessions
  getActiveSessions() {
    return Object.values(memoryStore.sosSessions).filter(s => s.status !== 'resolved');
  }
}

module.exports = new SOSService();