// backend/services/analytics.js

const memoryStore = require('../db/memoryStore');
const evidenceStore = require('../db/evidencestore');
const { Parser } = require('json2csv'); // For CSV export

class AnalyticsService {
  // Get dashboard data
  async getDashboardData({ from, to } = {}) {
    // Convert dates if provided
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    // Active sessions
    let activeSessions = Object.values(memoryStore.sosSessions);

    if (fromDate || toDate) {
      activeSessions = activeSessions.filter(session => {
        const created = new Date(session.createdAt);
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
        return true;
      });
    }

    // Count by severity
    const severityCount = activeSessions.reduce((acc, session) => {
      acc[session.severity] = (acc[session.severity] || 0) + 1;
      return acc;
    }, {});

    // Evidence stats
    const allEvidence = await evidenceStore.getAllEvidence();
    const evidenceCount = allEvidence.length;

    return {
      totalActiveSessions: activeSessions.length,
      severityCount,
      totalEvidence: evidenceCount,
      activeSessions,
    };
  }

  // Export analytics as CSV
  async exportCSV({ from, to, limit } = {}) {
    const dashboardData = await this.getDashboardData({ from, to });
    let rows = dashboardData.activeSessions;

    if (limit) {
      rows = rows.slice(0, limit);
    }

    // Flatten for CSV export
    const csvRows = rows.map(session => ({
      sessionId: session.id,
      userId: session.userId,
      severity: session.severity,
      status: session.status,
      createdAt: session.createdAt,
      helpers: session.helpers.join('|'),
      locationLat: session.location?.lat || '',
      locationLng: session.location?.lng || '',
    }));

    const parser = new Parser();
    const csv = parser.parse(csvRows);
    return csv;
  }
}

module.exports = new AnalyticsService();