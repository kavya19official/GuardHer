// backend/db/memoryStore.js

/**
 * In-memory data store for SOS sessions and live tracking
 * Enhanced with:
 * - TTL-based live location expiry
 * - Automatic cleanup
 * - Event hooks for analytics / websockets
 * - Safe helper management
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes TTL for live tracking

const memoryStore = {
  sosSessions: {},   // { sessionId: { id, userId, status, severity, location, helpers, createdAt } }
  liveTracking: {},  // { userId: { lat, lng, lastUpdated, expiresAt } }
};

// ---- Event hooks (optional listeners) ----
const events = {
  onAddSession: null,
  onUpdateSession: null,
  onDeleteSession: null,
};

// ---- Internal utility: clean expired live locations ----
const cleanUpExpiredLocations = () => {
  const now = Date.now();
  for (const userId in memoryStore.liveTracking) {
    if (memoryStore.liveTracking[userId].expiresAt <= now) {
      delete memoryStore.liveTracking[userId];
    }
  }
};

// Run cleanup every 60 seconds
setInterval(cleanUpExpiredLocations, 60 * 1000);

// ---- Public API ----
module.exports = {
  /* ===================== SOS SESSION METHODS ===================== */

  addSession: (sessionId, sessionData) => {
    const session = {
      helpers: [],
      ...sessionData,
    };
    memoryStore.sosSessions[sessionId] = session;

    if (events.onAddSession) {
      events.onAddSession(sessionId, session);
    }

    return session;
  },

  getSession: (sessionId) => {
    return memoryStore.sosSessions[sessionId] || null;
  },

  updateSession: (sessionId, updates) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session) return null;

    const updatedSession = { ...session, ...updates };
    memoryStore.sosSessions[sessionId] = updatedSession;

    if (events.onUpdateSession) {
      events.onUpdateSession(sessionId, updatedSession);
    }

    return updatedSession;
  },

  deleteSession: (sessionId) => {
    const deleted = memoryStore.sosSessions[sessionId] || null;
    delete memoryStore.sosSessions[sessionId];

    if (events.onDeleteSession) {
      events.onDeleteSession(sessionId, deleted);
    }

    return deleted;
  },

  getSessionsByUser: (userId) => {
    return Object.values(memoryStore.sosSessions).filter(
      (session) => session.userId === userId
    );
  },

  getSessionsByStatus: (status) => {
    return Object.values(memoryStore.sosSessions).filter(
      (session) => session.status === status
    );
  },

  /* ===================== HELPER MANAGEMENT ===================== */

  addHelperToSession: (sessionId, helperId) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session) return null;

    session.helpers = session.helpers || [];
    if (!session.helpers.includes(helperId)) {
      session.helpers.push(helperId);
    }

    return session;
  },

  removeHelperFromSession: (sessionId, helperId) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session || !session.helpers) return null;

    session.helpers = session.helpers.filter((id) => id !== helperId);
    return session;
  },

  /* ===================== LIVE LOCATION TRACKING ===================== */

  updateLiveLocation: (userId, lat, lng) => {
    const expiresAt = Date.now() + TTL_MS;

    memoryStore.liveTracking[userId] = {
      lat,
      lng,
      lastUpdated: new Date(),
      expiresAt,
    };

    return memoryStore.liveTracking[userId];
  },

  getLiveLocation: (userId) => {
    return memoryStore.liveTracking[userId] || null;
  },

  deleteLiveLocation: (userId) => {
    const deleted = memoryStore.liveTracking[userId] || null;
    delete memoryStore.liveTracking[userId];
    return deleted;
  },

  /* ===================== EVENT SYSTEM ===================== */

  setEventListener: (eventName, callback) => {
    if (Object.prototype.hasOwnProperty.call(events, eventName)) {
      events[eventName] = callback;
    }
  },

  /* ===================== DEBUG / ADMIN ===================== */

  _dump: () => ({
    sosSessions: memoryStore.sosSessions,
    liveTracking: memoryStore.liveTracking,
  }),
};