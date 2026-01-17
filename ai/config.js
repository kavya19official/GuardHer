// config.js - Central Configuration for AI Module

const config = {
  
  // ============================================
  // SERVER CONFIGURATION
  // ============================================
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: '/api/ai'
  },

  // ============================================
  // AI MODEL SETTINGS
  // ============================================
  ai: {
    // Severity thresholds
    severityThresholds: {
      high: {
        minKeywords: 1,
        minConfidence: 0.7
      },
      medium: {
        minKeywords: 2,
        minConfidence: 0.6
      },
      low: {
        minKeywords: 0,
        minConfidence: 0.5
      }
    },

    // Context weight factors
    contextWeights: {
      isNight: 0.05,
      isIsolated: 0.05,
      hasLocation: 0.03,
      hasWitness: -0.02  // Reduces severity slightly
    },

    // Maximum conversation history to analyze
    maxConversationMessages: 10,

    // Evidence confidence scores
    evidenceConfidence: {
      visual_evidence: 0.9,
      audio_evidence: 0.85,
      text_evidence: 0.8,
      witness_account: 0.75,
      location_data: 0.7
    }
  },

  // ============================================
  // CHATBOT CONFIGURATION
  // ============================================
  chatbot: {
    maxResponseLength: 500,
    conversationTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    defaultTone: 'supportive',
    enableEmergencyDetection: true,
    
    // Quick response templates
    quickResponses: {
      emergency: "I understand this is an emergency. Please call 112 (Police) or 100 (Women Helpline) immediately. I'm here to support you.",
      gratitude: "You're welcome. Stay safe, and remember I'm here anytime you need guidance.",
      unclear: "I want to help you better. Could you provide more details about your situation?"
    }
  },

  // ============================================
  // FIR GENERATOR SETTINGS
  // ============================================
  fir: {
    includeTimestamp: true,
    includeLocation: true,
    includeEvidence: true,
    format: 'structured', // 'structured' or 'narrative'
    language: 'english',
    
    // Required fields for FIR
    requiredFields: [
      'incidentDescription',
      'dateTime',
      'location'
    ],

    // Optional fields
    optionalFields: [
      'suspectDescription',
      'witnessDetails',
      'evidenceList',
      'injuries',
      'vehicleDetails'
    ]
  },

  // ============================================
  // EMERGENCY CONTACTS (India)
  // ============================================
  emergencyContacts: {
    police: '100',
    womenHelpline: '1091',
    nationalEmergency: '112',
    childHelpline: '1098',
    elderHelpline: '14567',
    medicalEmergency: '108'
  },

  // ============================================
  // SAFETY GUIDELINES
  // ============================================
  safetyGuidelines: {
    immediate: [
      'Call emergency services if in danger',
      'Move to well-lit public area',
      'Alert trusted contacts',
      'Document evidence safely'
    ],
    preventive: [
      'Share live location with trusted contacts',
      'Avoid isolated areas at night',
      'Keep phone charged and accessible',
      'Trust your instincts'
    ],
    postIncident: [
      'Seek medical attention if injured',
      'Report to police',
      'Preserve evidence',
      'Seek counseling support'
    ]
  },

  // ============================================
  // RATE LIMITING (for production)
  // ============================================
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Max requests per window
    message: 'Too many requests, please try again later'
  },

  // ============================================
  // LOGGING
  // ============================================
  logging: {
    enabled: true,
    level: process.env.LOG_LEVEL || 'info', // 'error', 'warn', 'info', 'debug'
    logRequests: true,
    logErrors: true
  },

  // ============================================
  // FEATURES FLAGS
  // ============================================
  features: {
    voiceDetection: false,        // Simulated feature
    psychologicalFirstAid: true,  // Text-based
    multiLanguageSupport: false,  // Future feature
    realTimeAnalysis: true,
    conversationHistory: true
  },

  // ============================================
  // API KEYS (Load from environment variables)
  // ============================================
  apiKeys: {
    // Example: If using external AI services later
    openai: process.env.OPENAI_API_KEY || null,
    claude: process.env.CLAUDE_API_KEY || null,
    // Add more as needed
  },

  // ============================================
  // DATABASE (if needed later)
  // ============================================
  database: {
    enabled: false,
    type: 'mongodb',
    uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/guardher'
  }

};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get configuration value by path
 * Example: getConfig('ai.severityThresholds.high.minConfidence')
 */
function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], config);
}

/**
 * Validate required environment variables
 */
function validateConfig() {
  const required = [
    // Add required env vars here if any
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
  }

  return missing.length === 0;
}

/**
 * Get emergency contact by type
 */
function getEmergencyContact(type) {
  return config.emergencyContacts[type] || config.emergencyContacts.nationalEmergency;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  config,
  getConfig,
  validateConfig,
  getEmergencyContact
};