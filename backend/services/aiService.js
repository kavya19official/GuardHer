// backend/services/aiService.js

const evidenceStore = require('../db/evidencestore');

class AIService {
  constructor(config = {}) {
    // Configurable risk scoring thresholds or logic can be provided via config
    this.config = {
      imageRiskThreshold: 0.3,
      audioRiskThreshold: 0.2,
      ...config,
    };
  }

  /**
   * Validate evidence input to ensure required fields and types
   * @param {Object} evidence
   * @throws {Error} if validation fails
   */
  validateEvidence(evidence) {
    if (!evidence || typeof evidence !== 'object') {
      throw new Error('Evidence must be a non-null object');
    }
    const { type, data, userId } = evidence;
    const validTypes = ['image', 'text', 'audio'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid evidence type: ${type}. Must be one of ${validTypes.join(', ')}`);
    }
    if (typeof data !== 'string' || data.trim() === '') {
      throw new Error('Evidence data must be a non-empty string');
    }
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Evidence userId must be a non-empty string');
    }
  }

  /**
   * Analyze a piece of evidence (image, text, audio, etc.)
   * For now, simulated/stub logic; can integrate real AI later.
   * @param {Object} evidence - { type: 'image'|'text'|'audio', data: string, userId: string }
   * @returns {Object} - Analysis result
   */
  async analyzeEvidence(evidence) {
    // Optional input validation
    this.validateEvidence(evidence);

    // Example: store evidence first
    const storedEvidence = await evidenceStore.addEvidence(evidence.userId, evidence.type, evidence.data);

    // Simulated AI analysis with configurable thresholds
    let riskLevel = 'low'; // default
    if (evidence.type === 'image') {
      riskLevel = Math.random() < this.config.imageRiskThreshold ? 'high' : 'medium';
    } else if (evidence.type === 'text') {
      riskLevel = evidence.data.toLowerCase().includes('help') ? 'high' : 'medium';
    } else if (evidence.type === 'audio') {
      riskLevel = Math.random() < this.config.audioRiskThreshold ? 'high' : 'low';
    }

    const analysisResult = {
      evidenceId: storedEvidence.id,
      userId: evidence.userId,
      type: evidence.type,
      riskLevel,
      timestamp: new Date(),
      message: `Simulated AI analysis: riskLevel=${riskLevel}`
    };

    // Log analysis result for debugging
    console.log('AIService.analyzeEvidence result:', analysisResult);

    return analysisResult;
  }

  /**
   * Predict severity based on user history or multiple signals
   * @param {Object} sessionData - { userId, location, previousSessions }
   * @returns {string} - Predicted severity ('low'|'medium'|'high')
   */
  predictSeverity(sessionData) {
    // Stub logic: you can replace with ML model
    // Input validation could be added here in future
    const rand = Math.random();
    if (rand < 0.2) return 'high';
    if (rand < 0.6) return 'medium';
    return 'low';
  }

  /**
   * Optional: batch analysis for multiple evidences
   * @param {Array} evidences - array of evidence objects
   * @returns {Array} - array of analysis results
   */
  async analyzeBatch(evidences) {
    if (!Array.isArray(evidences)) {
      throw new Error('analyzeBatch expects an array of evidences');
    }
    const results = [];
    for (const e of evidences) {
      const r = await this.analyzeEvidence(e);
      results.push(r);
    }
    return results;
  }

  /**
   * Analyze evidence and predict session severity together
   * @param {Object} evidence - single evidence object
   * @param {Object} sessionData - session data for severity prediction
   * @returns {Object} - combined result { analysisResult, predictedSeverity }
   */
  async analyzeAndPredict(evidence, sessionData) {
    // Analyze evidence first
    const analysisResult = await this.analyzeEvidence(evidence);

    // Predict severity based on session data
    const predictedSeverity = this.predictSeverity(sessionData);

    // Log combined result for debugging
    console.log('AIService.analyzeAndPredict result:', { analysisResult, predictedSeverity });

    return { analysisResult, predictedSeverity };
  }
}

module.exports = new AIService();