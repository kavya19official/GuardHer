// analyzeMessage.js - Severity Classification & Evidence Analysis

/**
 * Analyzes incident message and returns severity level + AI labels
 * @param {string} message - User's incident description
 * @param {object} context - Additional context (location, time, etc.)
 * @returns {object} - Severity level, risk factors, and evidence labels
 */
function analyzeMessage(message, context = {}) {
  const analysis = {
    severity: 'LOW',
    confidence: 0,
    riskFactors: [],
    evidenceLabels: [],
    recommendations: [],
    timestamp: new Date().toISOString()
  };

  // Convert to lowercase for easier matching
  const text = message.toLowerCase();

  // HIGH SEVERITY Keywords
  const highSeverityKeywords = [
    'assault', 'attacked', 'rape', 'kidnap', 'weapon', 'knife', 'gun',
    'bleeding', 'injured', 'unconscious', 'emergency', 'help me',
    'chasing', 'grabbed', 'forced', 'threatening', 'violence'
  ];

  // MEDIUM SEVERITY Keywords
  const mediumSeverityKeywords = [
    'following', 'stalking', 'harass', 'uncomfortable', 'scared',
    'suspicious', 'alone', 'dark', 'unsafe', 'stranger', 'touched',
    'catcall', 'lewd', 'inappropriate', 'creepy', 'threatening'
  ];

  // LOW SEVERITY Keywords
  const lowSeverityKeywords = [
    'concerned', 'worried', 'advice', 'precaution', 'question',
    'feeling unsafe', 'not sure', 'should i', 'what if'
  ];

  // Count keyword matches
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  highSeverityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      highCount++;
      analysis.riskFactors.push(keyword);
    }
  });

  mediumSeverityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      mediumCount++;
      analysis.riskFactors.push(keyword);
    }
  });

  lowSeverityKeywords.forEach(keyword => {
    if (text.includes(keyword)) lowCount++;
  });

  // SEVERITY DECISION LOGIC
  if (highCount >= 1) {
    analysis.severity = 'HIGH';
    analysis.confidence = Math.min(0.7 + (highCount * 0.1), 0.95);
    analysis.recommendations = [
      'Contact emergency services immediately (112/100)',
      'Share live location with trusted contacts',
      'Activate SOS alert',
      'Document evidence if safe to do so'
    ];
  } else if (mediumCount >= 2 || (mediumCount >= 1 && context.isNight)) {
    analysis.severity = 'MEDIUM';
    analysis.confidence = 0.6 + (mediumCount * 0.05);
    analysis.recommendations = [
      'Alert trusted contacts',
      'Move to well-lit public area',
      'Call safety helpline',
      'Document incident details'
    ];
  } else {
    analysis.severity = 'LOW';
    analysis.confidence = 0.5;
    analysis.recommendations = [
      'Review safety guidelines',
      'Plan safe routes',
      'Keep emergency contacts ready',
      'Consider safety coaching'
    ];
  }

  // EVIDENCE LABELING
  analysis.evidenceLabels = generateEvidenceLabels(text, analysis.severity);

  // Context-based adjustments
  if (context.isNight) analysis.confidence += 0.05;
  if (context.isIsolated) analysis.confidence += 0.05;
  if (context.hasLocation) analysis.evidenceLabels.push('location_data');

  return analysis;
}

/**
 * Generate evidence labels based on message content
 */
function generateEvidenceLabels(text, severity) {
  const labels = [];

  // Evidence type detection
  if (text.includes('photo') || text.includes('picture') || text.includes('image')) {
    labels.push('visual_evidence');
  }
  if (text.includes('recording') || text.includes('audio') || text.includes('voice')) {
    labels.push('audio_evidence');
  }
  if (text.includes('message') || text.includes('text') || text.includes('chat')) {
    labels.push('text_evidence');
  }
  if (text.includes('witness') || text.includes('saw') || text.includes('people')) {
    labels.push('witness_account');
  }

  // Incident type labels
  if (text.includes('physical') || text.includes('touch') || text.includes('grab')) {
    labels.push('physical_incident');
  }
  if (text.includes('verbal') || text.includes('said') || text.includes('comment')) {
    labels.push('verbal_harassment');
  }
  if (text.includes('online') || text.includes('social media') || text.includes('internet')) {
    labels.push('cyber_incident');
  }

  // Time-sensitive marker
  if (severity === 'HIGH') {
    labels.push('immediate_action_required');
  }

  return [...new Set(labels)]; // Remove duplicates
}

/**
 * Batch analyze multiple messages (for chat history)
 */
function analyzeConversation(messages) {
  let maxSeverity = 'LOW';
  const allRisks = [];
  
  messages.forEach(msg => {
    const result = analyzeMessage(msg.text, msg.context);
    
    if (result.severity === 'HIGH') maxSeverity = 'HIGH';
    else if (result.severity === 'MEDIUM' && maxSeverity !== 'HIGH') {
      maxSeverity = 'MEDIUM';
    }
    
    allRisks.push(...result.riskFactors);
  });

  return {
    overallSeverity: maxSeverity,
    totalRisks: [...new Set(allRisks)],
    messageCount: messages.length
  };
}

// Export for use in other modules
module.exports = {
  analyzeMessage,
  analyzeConversation,
  generateEvidenceLabels
};