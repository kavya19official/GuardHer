// api.js - API Routes for AI Module

const express = require('express');
const router = express.Router();
const { analyzeMessage, analyzeConversation } = require('./analyzeMessage');
const { generateFIRSummary } = require('./firGenerator');
const { chatWithCoach } = require('./safetyCoach');

// Middleware to parse JSON
router.use(express.json());

// ============================================
// 1. SEVERITY ANALYSIS ENDPOINT
// ============================================
/**
 * POST /api/ai/analyze
 * Analyzes incident message and returns severity
 */
router.post('/analyze', (req, res) => {
  try {
    const { message, context } = req.body;

    // Validation
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Analyze the message
    const analysis = analyzeMessage(message, context || {});

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze message'
    });
  }
});

// ============================================
// 2. CONVERSATION ANALYSIS ENDPOINT
// ============================================
/**
 * POST /api/ai/analyze-conversation
 * Analyzes multiple messages for overall severity
 */
router.post('/analyze-conversation', (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    const analysis = analyzeConversation(messages);

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Conversation analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze conversation'
    });
  }
});

// ============================================
// 3. SAFETY COACH CHATBOT ENDPOINT
// ============================================
/**
 * POST /api/ai/coach
 * Chat with AI safety coach
 */
router.post('/coach', async (req, res) => {
  try {
    const { question, conversationHistory } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const response = await chatWithCoach(question, conversationHistory || []);

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Coach chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get coach response'
    });
  }
});

// ============================================
// 4. FIR GENERATION ENDPOINT
// ============================================
/**
 * POST /api/ai/generate-fir
 * Generates FIR summary from incident details
 */
router.post('/generate-fir', async (req, res) => {
  try {
    const { incidentData } = req.body;

    if (!incidentData) {
      return res.status(400).json({
        success: false,
        error: 'Incident data is required'
      });
    }

    const firSummary = await generateFIRSummary(incidentData);

    res.status(200).json({
      success: true,
      data: firSummary
    });

  } catch (error) {
    console.error('FIR generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate FIR summary'
    });
  }
});

// ============================================
// 5. HEALTH CHECK ENDPOINT
// ============================================
/**
 * GET /api/ai/health
 * Check if AI service is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Module is running',
    timestamp: new Date().toISOString()
  });
});

// Export router
module.exports = router;