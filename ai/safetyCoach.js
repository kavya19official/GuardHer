// safetyCoach.js - Q&A Safety Coach Chatbot with Emotional Support

const { prompts, detectTopic, getRandomResponse, fillTemplate } = require('./prompt');
const { analyzeMessage } = require('./analyzeMessage');

/**
 * Main chatbot function - handles user questions and provides safety guidance
 * @param {string} question - User's question or concern
 * @param {array} conversationHistory - Previous messages in conversation
 * @returns {object} - Bot response with guidance and recommendations
 */
async function chatWithCoach(question, conversationHistory = []) {
  try {
    // Validate input
    if (!question || question.trim() === '') {
      return {
        response: "I'm here to help. Please share what's on your mind or ask me any safety-related question.",
        type: 'prompt',
        severity: 'LOW'
      };
    }

    // Check if this is first message
    const isFirstMessage = conversationHistory.length === 0;

    // Detect if this is an emergency
    const isEmergency = detectEmergency(question);
    
    if (isEmergency) {
      return handleEmergency(question);
    }

    // Analyze severity of the situation
    const analysis = analyzeMessage(question, {});

    // Detect conversation topic
    const { topic, response: topicResponse } = detectTopic(question);

    // Build response based on context
    let botResponse = '';
    let recommendations = [];
    let resources = [];

    // Add acknowledgment
    if (!isFirstMessage) {
      botResponse += getRandomResponse(prompts.responseTemplates.acknowledgment) + '\n\n';
    }

    // Add topic-specific response
    if (topicResponse) {
      botResponse += topicResponse;
    } else {
      // General safety guidance
      botResponse += provideGeneralGuidance(question, analysis);
    }

    // Add severity-based recommendations
    recommendations = getSeverityRecommendations(analysis.severity);

    // Add relevant resources
    resources = getRelevantResources(topic, analysis.severity);

    // Check for emotional support needs
    const needsEmotionalSupport = detectEmotionalNeed(question);
    let emotionalSupport = null;

    if (needsEmotionalSupport) {
      emotionalSupport = provideEmotionalSupport(question);
    }

    return {
      response: botResponse,
      type: topic,
      severity: analysis.severity,
      recommendations: recommendations,
      resources: resources,
      emotionalSupport: emotionalSupport,
      conversationId: generateConversationId(),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Safety Coach Error:', error);
    return {
      response: "I'm here to help, but I encountered an issue. Could you rephrase your question? If this is urgent, please call 112 or 100 immediately.",
      type: 'error',
      severity: 'UNKNOWN'
    };
  }
}

/**
 * Detect if message indicates emergency
 */
function detectEmergency(message) {
  const text = message.toLowerCase();
  const emergencyKeywords = [
    'help me', 'help!', 'emergency', 'danger', 'attacking', 
    'assault', 'rape', 'weapon', 'knife', 'gun', 'bleeding',
    'injured', 'kidnap', 'being attacked', 'right now'
  ];

  return emergencyKeywords.some(keyword => text.includes(keyword));
}

/**
 * Handle emergency situations
 */
function handleEmergency(message) {
  return {
    response: `🚨 **EMERGENCY DETECTED**

Your safety is at immediate risk. Please take these actions RIGHT NOW:

**IMMEDIATE ACTIONS:**
1. ☎️ Call 112 (National Emergency) or 100 (Police) IMMEDIATELY
2. 📍 Share your live location with trusted contacts
3. 🏃 Move to a safe, public place if possible
4. 📱 Keep your phone accessible
5. 🎥 Start recording audio/video if safe to do so

**Emergency Numbers:**
- Police: 100
- National Emergency: 112
- Women Helpline: 1091
- Ambulance: 108

I'm here to support you, but please prioritize calling emergency services RIGHT NOW. Your safety is the top priority.

Are you able to call for help? Let me know if you need guidance on next steps.`,
    type: 'emergency',
    severity: 'HIGH',
    recommendations: [
      'Call emergency services immediately',
      'Move to safe location',
      'Alert trusted contacts',
      'Preserve evidence'
    ],
    resources: [
      { name: 'Police', number: '100' },
      { name: 'National Emergency', number: '112' },
      { name: 'Women Helpline', number: '1091' }
    ],
    isEmergency: true
  };
}

/**
 * Provide general safety guidance for unclear queries
 */
function provideGeneralGuidance(question, analysis) {
  const text = question.toLowerCase();
  let guidance = '';

  // Check what user might be asking about
  if (text.includes('safe') || text.includes('protect') || text.includes('prevent')) {
    guidance = `Here are general safety guidelines to keep you protected:

**Personal Safety:**
- Trust your instincts - if something feels wrong, it probably is
- Stay alert and aware of your surroundings
- Keep your phone charged and accessible
- Share your location with trusted contacts
- Avoid isolated areas, especially at night

**Emergency Preparedness:**
- Save emergency numbers on speed dial
- Know the location of nearby police stations
- Keep important contacts readily available
- Learn basic self-defense techniques

**Digital Safety:**
- Be cautious with personal information online
- Use strong privacy settings
- Don't share location publicly in real-time
- Report any online harassment immediately

Is there a specific situation you'd like guidance on?`;
  } 
  else if (text.includes('what') || text.includes('how') || text.includes('should')) {
    guidance = `I'm here to help! I can assist you with:

✓ Emergency response guidance
✓ Safety tips for specific situations
✓ Information about your legal rights
✓ How to report incidents
✓ Transport and travel safety
✓ Online/cyber safety
✓ Dealing with harassment or stalking
✓ Self-defense strategies
✓ Support resources

What specific situation would you like help with?`;
  }
  else {
    guidance = `I understand you're concerned about your safety. I'm here to help with any situation you're facing.

Based on what you've shared, here are some things to consider:

${analysis.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

Would you like to tell me more about your specific concern so I can provide more targeted guidance?`;
  }

  return guidance;
}

/**
 * Get recommendations based on severity
 */
function getSeverityRecommendations(severity) {
  switch(severity) {
    case 'HIGH':
      return [
        'Contact emergency services immediately (112/100)',
        'Share live location with trusted contacts',
        'Move to well-lit, crowded area if possible',
        'Document everything - photos, videos, messages',
        'Seek medical attention if injured',
        'File police complaint as soon as safe'
      ];
    
    case 'MEDIUM':
      return [
        'Alert trusted contacts about the situation',
        'Move to a safe, public location',
        'Call Women Helpline 1091 for guidance',
        'Document incident details immediately',
        'Consider filing police complaint',
        'Avoid being alone until situation resolves'
      ];
    
    case 'LOW':
    default:
      return [
        'Stay alert and trust your instincts',
        'Share your plans with someone you trust',
        'Keep emergency contacts accessible',
        'Review safety guidelines for your situation',
        'Consider taking self-defense training',
        'Join community safety groups'
      ];
  }
}

/**
 * Get relevant resources based on topic and severity
 */
function getRelevantResources(topic, severity) {
  const resources = [];

  // Emergency resources for high severity
  if (severity === 'HIGH') {
    resources.push(
      { name: 'Police Emergency', number: '100', type: 'emergency' },
      { name: 'National Emergency', number: '112', type: 'emergency' },
      { name: 'Women Helpline', number: '1091', type: 'emergency' },
      { name: 'Ambulance', number: '108', type: 'emergency' }
    );
  }

  // Topic-specific resources
  switch(topic) {
    case 'cyber':
      resources.push(
        { name: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in', type: 'reporting' },
        { name: 'Women Helpline', number: '1091', type: 'support' }
      );
      break;
    
    case 'legal':
      resources.push(
        { name: 'Legal Services Authority', number: '15100', type: 'legal' },
        { name: 'Women Commission', url: 'https://ncw.nic.in', type: 'legal' }
      );
      break;
    
    case 'emotional':
      resources.push(
        { name: 'Vandrevala Foundation', number: '1860-2662-345', type: 'mental_health' },
        { name: 'iCall Helpline', number: '9152987821', type: 'mental_health' },
        { name: 'NIMHANS', number: '080-46110007', type: 'mental_health' }
      );
      break;
    
    default:
      resources.push(
        { name: 'Women Helpline', number: '1091', type: 'support' },
        { name: 'Police', number: '100', type: 'emergency' }
      );
  }

  return resources;
}

/**
 * Detect if user needs emotional support
 */
function detectEmotionalNeed(message) {
  const text = message.toLowerCase();
  const emotionalKeywords = [
    'scared', 'afraid', 'terrified', 'anxious', 'worried', 
    'panic', 'stress', 'fear', 'traumatized', 'upset',
    'crying', 'shaking', 'can\'t sleep', 'nightmare',
    'depressed', 'helpless', 'alone'
  ];

  return emotionalKeywords.some(keyword => text.includes(keyword));
}

/**
 * Provide emotional support and psychological first aid
 */
function provideEmotionalSupport(message) {
  const text = message.toLowerCase();
  let support = {
    immediateComfort: '',
    copingTechnique: '',
    professionalHelp: []
  };

  // Immediate comfort
  support.immediateComfort = `💚 I want you to know:

- You are safe right now
- What you're feeling is completely normal
- Your reaction is valid
- You are not alone
- It's okay to ask for help
- This is not your fault

Take a moment to breathe. You've been brave by reaching out.`;

  // Suggest coping technique based on emotional state
  if (text.includes('panic') || text.includes('anxious') || text.includes('shaking')) {
    support.copingTechnique = `**Grounding Technique (Try this now):**

Look around and name:
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

**Breathing Exercise:**
1. Breathe in slowly for 4 counts
2. Hold for 4 counts
3. Breathe out slowly for 4 counts
4. Repeat 4 times

This can help calm your nervous system.`;
  } 
  else if (text.includes('scared') || text.includes('afraid') || text.includes('terrified')) {
    support.copingTechnique = `**Safety Reassurance:**

Right now, in this moment:
- You are in a safe space
- You have taken action by reaching out
- You have control over your next steps
- Help is available to you

**What might help:**
- Talk to someone you trust
- Focus on what you can control
- Take things one step at a time
- Be gentle with yourself`;
  }
  else {
    support.copingTechnique = `**Self-Care Reminders:**

- Your feelings are valid - allow yourself to feel them
- Healing is not linear - take your time
- Small steps are still progress
- You deserve support and care
- It's okay to not be okay right now

**Things that might help:**
- Talk to a trusted friend or family member
- Write down your feelings
- Engage in activities that comfort you
- Get adequate rest
- Reach out to professional support`;
  }

  // Professional help resources
  support.professionalHelp = [
    { name: 'Vandrevala Foundation (24/7)', number: '1860-2662-345', note: 'Free mental health support' },
    { name: 'iCall Psychological Helpline', number: '9152987821', note: 'Mon-Sat, 8am-10pm' },
    { name: 'NIMHANS Helpline', number: '080-46110007', note: 'Mental health emergency' }
  ];

  return support;
}

/**
 * Generate unique conversation ID
 */
function generateConversationId() {
  return `coach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get conversation context summary
 */
function getConversationSummary(conversationHistory) {
  if (conversationHistory.length === 0) {
    return 'New conversation';
  }

  const messageCount = conversationHistory.length;
  const topics = conversationHistory.map(msg => msg.topic).filter(Boolean);
  const uniqueTopics = [...new Set(topics)];

  return {
    messageCount,
    topics: uniqueTopics,
    duration: 'ongoing'
  };
}

/**
 * Check if user is satisfied or needs more help
 */
function needsFollowUp(message) {
  const text = message.toLowerCase();
  const satisfactionKeywords = ['thank', 'thanks', 'helpful', 'got it', 'understand', 'okay', 'ok'];
  const needsMoreKeywords = ['but', 'what if', 'also', 'another', 'more'];

  const isSatisfied = satisfactionKeywords.some(keyword => text.includes(keyword));
  const needsMore = needsMoreKeywords.some(keyword => text.includes(keyword));

  return !isSatisfied || needsMore;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  chatWithCoach,
  detectEmergency,
  handleEmergency,
  provideEmotionalSupport,
  getSeverityRecommendations,
  getRelevantResources
};