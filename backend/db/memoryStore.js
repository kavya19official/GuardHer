// db/memoryStore.js

// In-memory store object
const memoryStore = {
  sosSessions: {},     // active SOS sessions: { sessionId: { userId, status, location, helpers } }
  liveTracking: {}     // live tracking info: { userId: { lat, lng, lastUpdated } }
};

module.exports = {
  // ---- SOS Session Methods ----
  
  addSession: (sessionId, sessionData) => {
    memoryStore.sosSessions[sessionId] = sessionData;
    return memoryStore.sosSessions[sessionId];
  },

  getSession: (sessionId) => {
    return memoryStore.sosSessions[sessionId] || null;
  },

  updateSession: (sessionId, updates) => {
    if (!memoryStore.sosSessions[sessionId]) return null;
    memoryStore.sosSessions[sessionId] = {
      ...memoryStore.sosSessions[sessionId],
      ...updates
    };
    return memoryStore.sosSessions[sessionId];
  },

  deleteSession: (sessionId) => {
    const deleted = memoryStore.sosSessions[sessionId];
    delete memoryStore.sosSessions[sessionId];
    return deleted || null;
  },

  // ---- Live Tracking Methods ----
  
  updateLiveLocation: (userId, lat, lng) => {
    memoryStore.liveTracking[userId] = { lat, lng, lastUpdated: new Date() };
    return memoryStore.liveTracking[userId];
  },

  getLiveLocation: (userId) => {
    return memoryStore.liveTracking[userId] || null;
  },

  deleteLiveLocation: (userId) => {
    const deleted = memoryStore.liveTracking[userId];
    delete memoryStore.liveTracking[userId];
    return deleted || null;
  }
};