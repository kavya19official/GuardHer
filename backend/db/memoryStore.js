// db/memoryStore.js

const TTL_MS = 5 * 60 * 1000; // 5 minutes for live tracking expiration
const memoryStore = {
  sosSessions: {},     // { sessionId: { userId, status, location, helpers } }
  liveTracking: {}     // { userId: { lat, lng, lastUpdated, expiresAt } }
};

// Event hooks for reactive updates
const events = {
  onAddSession: null,
  onUpdateSession: null,
  onDeleteSession: null,
};

// ---- Utility: Clean expired live locations ----
const cleanUpExpiredLocations = () => {
  const now = Date.now();
  for (const userId in memoryStore.liveTracking) {
    if (memoryStore.liveTracking[userId].expiresAt < now) {
      delete memoryStore.liveTracking[userId];
    }
  }
};

// Schedule cleanup every minute
setInterval(cleanUpExpiredLocations, 60 * 1000);

module.exports = {
  // ---- SOS Session Methods ----

  addSession: (sessionId, sessionData) => {
    memoryStore.sosSessions[sessionId] = {
      helpers: [],
      ...sessionData
    };
    if (events.onAddSession) events.onAddSession(sessionId, memoryStore.sosSessions[sessionId]);
    return memoryStore.sosSessions[sessionId];
  },

  getSession: (sessionId) => {
    return memoryStore.sosSessions[sessionId] || null;
  },

  updateSession: (sessionId, updates) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session) return null;
    memoryStore.sosSessions[sessionId] = { ...session, ...updates };
    if (events.onUpdateSession) events.onUpdateSession(sessionId, memoryStore.sosSessions[sessionId]);
    return memoryStore.sosSessions[sessionId];
  },

  deleteSession: (sessionId) => {
    const deleted = memoryStore.sosSessions[sessionId];
    delete memoryStore.sosSessions[sessionId];
    if (events.onDeleteSession) events.onDeleteSession(sessionId, deleted);
    return deleted || null;
  },

  // ---- Helper Management ----
  addHelperToSession: (sessionId, helperId) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session) return null;
    session.helpers = session.helpers || [];
    if (!session.helpers.includes(helperId)) session.helpers.push(helperId);
    return session;
  },

  removeHelperFromSession: (sessionId, helperId) => {
    const session = memoryStore.sosSessions[sessionId];
    if (!session || !session.helpers) return null;
    session.helpers = session.helpers.filter(id => id !== helperId);
    return session;
  },

  getSessionsByUser: (userId) => {
    return Object.values(memoryStore.sosSessions).filter(s => s.userId === userId);
  },

  getSessionsByStatus: (status) => {
    return Object.values(memoryStore.sosSessions).filter(s => s.status === status);
  },

  // ---- Live Tracking Methods ----

  updateLiveLocation: (userId, lat, lng) => {
    const expiresAt = Date.now() + TTL_MS;
    memoryStore.liveTracking[userId] = { lat, lng, lastUpdated: new Date(), expiresAt };
    return memoryStore.liveTracking[userId];
  },

  getLiveLocation: (userId) => {
    return memoryStore.liveTracking[userId] || null;
  },

  deleteLiveLocation: (userId) => {
    const deleted = memoryStore.liveTracking[userId];
    delete memoryStore.liveTracking[userId];
    return deleted || null;
  },

  // ---- Event Hooks ----
  setEventListener: (eventName, callback) => {
    if (events[eventName] !== undefined) {
      events[eventName] = callback;
    }
  }
};