// backend/services/analytics.js

const memoryStore = require('../db/memoryStore');
const evidenceStore = require('../db/evidencestore');
const { Parser } = require('json2csv'); // For CSV export

class AnalyticsService {
  /**
   * Get dashboard data with optional filters and pagination.
   * @param {Object} params
   * @param {string} [params.from]
   * @param {string} [params.to]
   * @param {string} [params.severity]
   * @param {string} [params.status]
   * @param {number} [params.page]
   * @param {number} [params.limit]
   * @returns {Object}
   */
  async getDashboardData({ from, to, severity, status, page, limit } = {}) {
    // Convert dates if provided
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    // Get all sessions
    let sessions = Object.values(memoryStore.sosSessions);

    // Date filtering
    if (fromDate || toDate) {
      sessions = sessions.filter(session => {
        const created = new Date(session.createdAt);
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
        return true;
      });
    }

    // Filtering by severity
    if (severity) {
      sessions = sessions.filter(session => session.severity === severity);
    }
    // Filtering by status
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    // Evidence stats
    const allEvidence = await evidenceStore.getAllEvidence();
    // Map evidence by sessionId for quick lookup
    const evidenceBySession = {};
    for (const evidence of allEvidence) {
      if (!evidenceBySession[evidence.sessionId]) {
        evidenceBySession[evidence.sessionId] = 1;
      } else {
        evidenceBySession[evidence.sessionId]++;
      }
    }

    // Add evidenceCount to each session
    const sessionsWithEvidence = sessions.map(session => ({
      ...session,
      evidenceCount: evidenceBySession[session.id] || 0,
    }));

    // Pagination
    let paginatedSessions = sessionsWithEvidence;
    let totalSessions = sessionsWithEvidence.length;
    let pageNum = page ? parseInt(page, 10) : null;
    let limitNum = limit ? parseInt(limit, 10) : null;
    if (pageNum && limitNum) {
      const start = (pageNum - 1) * limitNum;
      paginatedSessions = sessionsWithEvidence.slice(start, start + limitNum);
    } else if (limitNum) {
      paginatedSessions = sessionsWithEvidence.slice(0, limitNum);
    }

    // Summary statistics
    // For summary, use all sessions filtered by date (not by severity/status)
    let allSessionsForSummary = Object.values(memoryStore.sosSessions);
    if (fromDate || toDate) {
      allSessionsForSummary = allSessionsForSummary.filter(session => {
        const created = new Date(session.createdAt);
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
        return true;
      });
    }
    const summary = {
      totalSessions: allSessionsForSummary.length,
      active: allSessionsForSummary.filter(s => s.status === 'active').length,
      resolved: allSessionsForSummary.filter(s => s.status === 'resolved').length,
      highSeverity: allSessionsForSummary.filter(s => s.severity === 'high').length,
    };

    // Count by severity (of returned sessions)
    const severityCount = sessionsWithEvidence.reduce((acc, session) => {
      acc[session.severity] = (acc[session.severity] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSessions,
      severityCount,
      totalEvidence: allEvidence.length,
      summary,
      sessions: paginatedSessions,
    };
  }

  /**
   * Export analytics as CSV, with optional filters and pagination.
   * @param {Object} params
   * @param {string} [params.from]
   * @param {string} [params.to]
   * @param {string} [params.severity]
   * @param {string} [params.status]
   * @param {number} [params.page]
   * @param {number} [params.limit]
   * @returns {string} - CSV string
   */
  async exportCSV({ from, to, severity, status, page, limit } = {}) {
    const dashboardData = await this.getDashboardData({ from, to, severity, status, page, limit });
    let rows = dashboardData.sessions;

    // Flatten for CSV export
    const csvRows = rows.map(session => ({
      sessionId: session.id,
      userId: session.userId,
      severity: session.severity,
      status: session.status,
      createdAt: session.createdAt,
      helpers: session.helpers ? session.helpers.join('|') : '',
      locationLat: session.location?.lat || '',
      locationLng: session.location?.lng || '',
      evidenceCount: session.evidenceCount || 0,
    }));

    const parser = new Parser();
    const csv = parser.parse(csvRows);
    return csv;
  }
}

module.exports = new AnalyticsService();