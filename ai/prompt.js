// prompt.js - All AI prompts and response templates for the system

const prompts = {

  // ============================================
  // SAFETY COACH CHATBOT PROMPTS
  // ============================================
  
  safetyCoach: {
    systemPrompt: `You are a compassionate and knowledgeable women's safety coach for GuardHer app. Your role is to:
    
1. Provide immediate, practical safety advice
2. Offer emotional support with empathy
3. Guide users through safety protocols
4. Help assess risk levels in situations
5. Provide legal awareness about women's rights in India

Guidelines:
- Always prioritize user's immediate safety
- Be empathetic, calm, and supportive
- Give clear, actionable advice
- Never blame or judge the user
- Recognize emergency situations and advise calling 112/100 immediately
- Use simple, easy-to-understand language
- Provide India-specific legal and safety information

Remember: You are a supportive coach, not a replacement for emergency services.`,

    greetingMessages: [
      "Hello! I'm your safety coach. I'm here to help you stay safe and answer any safety-related questions. How can I assist you today?",
      "Hi! I'm here to support you with any safety concerns or questions. What would you like to know?",
      "Welcome! I'm your personal safety advisor. Feel free to ask me anything about staying safe."
    ],

    emergencyDetectionPrompt: `Analyze if this message indicates an emergency situation requiring immediate help:
    
Message: {message}

Emergency indicators:
- Words like: help, emergency, danger, attack, assault, threatening, weapon, hurt, injured
- Urgent tone or panic
- Immediate threat to safety

Respond with: EMERGENCY or NON_EMERGENCY`,

    topicCategories: {
      emergency: {
        keywords: ['help', 'emergency', 'danger', 'attack', 'assault', 'now', 'immediate', 'urgent'],
        response: "This sounds like an emergency. Please call 112 (National Emergency) or 100 (Police) immediately. Stay in a safe location if possible. Would you like me to guide you through immediate safety steps?"
      },
      
      stalking: {
        keywords: ['following', 'stalking', 'watching', 'tracking', 'chase'],
        response: "Being followed is serious. Here's what to do:\n\n1. Stay in well-lit, public areas\n2. Don't go home - go to a police station, shop, or crowded place\n3. Call a trusted contact and share your live location\n4. Vary your route if this happens regularly\n5. Document everything - times, locations, descriptions\n6. File a police complaint under IPC Section 354D (Stalking)\n\nAre you being followed right now?"
      },
      
      harassment: {
        keywords: ['harass', 'comment', 'catcall', 'stare', 'uncomfortable', 'inappropriate'],
        response: "I'm sorry you're experiencing harassment. You have the right to feel safe. Here's what you can do:\n\n1. Firmly say 'NO' or 'STOP' if safe to do so\n2. Move to a crowded area\n3. Document the incident (date, time, location, description)\n4. Report to local police or use women's helpline 1091\n5. Tell trusted people about the situation\n\nThis can be reported under IPC Section 354A (Sexual Harassment). Would you like help documenting this incident?"
      },
      
      nightSafety: {
        keywords: ['night', 'dark', 'late', 'alone', 'evening'],
        response: "Nighttime safety is important. Here are key tips:\n\n1. Share your live location with trusted contacts\n2. Stay in well-lit areas with people around\n3. Keep phone charged and accessible\n4. Use trusted transport - avoid empty buses/autos\n5. Walk confidently and stay alert\n6. Have emergency numbers on speed dial\n7. Trust your instincts - if something feels wrong, it probably is\n\nAre you traveling somewhere right now? I can give specific advice."
      },
      
      transport: {
        keywords: ['cab', 'taxi', 'auto', 'rickshaw', 'uber', 'ola', 'bus', 'metro', 'ride'],
        response: "Transport safety checklist:\n\n1. Share trip details with trusted contacts\n2. Check driver photo and vehicle number\n3. Sit in back seat, never front\n4. Keep one window slightly open\n5. Stay alert, don't sleep\n6. Have emergency contact ready\n7. Trust your gut - cancel if something feels off\n\nFor suspicious behavior, call 112 immediately. Are you in a vehicle now?"
      },
      
      cyber: {
        keywords: ['online', 'social media', 'messages', 'photos', 'cyber', 'blackmail', 'leak'],
        response: "Online safety is crucial. Here's what to do:\n\n1. Don't engage with the harasser\n2. Take screenshots of everything\n3. Block and report the account\n4. Don't share personal information online\n5. Report to Cyber Crime Portal: cybercrime.gov.in\n6. File FIR under IT Act Section 66E or 67\n\nFor blackmail/threats, contact police immediately. Need help documenting cyber evidence?"
      },
      
      legal: {
        keywords: ['fir', 'police', 'complaint', 'report', 'legal', 'law', 'rights', 'section'],
        response: "You have strong legal rights. Key information:\n\n**Important Laws:**\n- IPC 354A: Sexual Harassment\n- IPC 354D: Stalking\n- IPC 509: Insulting modesty\n- IPC 375/376: Rape\n- IPC 354: Assault on woman\n\n**Your Rights:**\n- Zero FIR - file anywhere in India\n- Women police stations available\n- Right to free legal aid\n- Cannot be detained at police station\n\n**Helplines:**\n- Women Helpline: 1091\n- Police: 100\n- National Emergency: 112\n\nWould you like help preparing an FIR?"
      },
      
      emotional: {
        keywords: ['scared', 'afraid', 'anxious', 'worried', 'panic', 'stress', 'fear', 'traumatized'],
        response: "Your feelings are completely valid. What you're experiencing is real, and you deserve support.\n\n**Immediate comfort:**\n- Take slow, deep breaths\n- You are not alone\n- This is not your fault\n- Your safety matters most\n\n**Support resources:**\n- National Women Helpline: 1091\n- Mental Health Helpline: 9152987821\n- Talk to trusted friends/family\n\nWould you like to talk through what happened? Or would practical safety steps help right now?"
      }
    }
  },

  // ============================================
  // SEVERITY CLASSIFICATION PROMPTS
  // ============================================
  
  severityAnalysis: {
    highSeverityPrompt: `HIGH SEVERITY INCIDENT DETECTED

Risk Level: CRITICAL
Recommended Action: IMMEDIATE RESPONSE REQUIRED

This incident involves:
- Immediate threat to personal safety
- Physical violence or assault
- Weapons or dangerous situations
- Need for emergency services

IMMEDIATE STEPS:
1. Call 112 (National Emergency) or 100 (Police)
2. Move to safe location if possible
3. Alert trusted contacts
4. Preserve evidence
5. Seek medical attention if injured`,

    mediumSeverityPrompt: `MEDIUM SEVERITY INCIDENT DETECTED

Risk Level: ELEVATED
Recommended Action: TAKE PRECAUTIONARY MEASURES

This incident involves:
- Harassment or threatening behavior
- Stalking or following
- Uncomfortable or unsafe situations
- Potential escalation risk

RECOMMENDED STEPS:
1. Alert trusted contacts immediately
2. Move to well-lit, public area
3. Document incident details
4. Consider calling Women Helpline 1091
5. File police complaint if necessary`,

    lowSeverityPrompt: `LOW SEVERITY - PREVENTIVE GUIDANCE

Risk Level: PRECAUTIONARY
Recommended Action: AWARENESS AND PREPARATION

This appears to be:
- General safety inquiry
- Preventive measures needed
- Awareness request
- Planning for safety

RECOMMENDED STEPS:
1. Review safety guidelines
2. Share location with trusted contacts
3. Plan safe routes
4. Keep emergency numbers ready
5. Stay alert and trust instincts`
  },

  // ============================================
  // FIR GENERATION PROMPTS
  // ============================================
  
  firGeneration: {
    summaryPrompt: `Generate a clear, factual FIR summary based on this incident:

Incident Details: {incidentDetails}

Include:
1. Date, time, and location
2. Clear description of what happened
3. Suspect description (if available)
4. Evidence available
5. Injuries or damage
6. Witnesses present
7. Actions taken

Format: Professional, factual, chronological narrative suitable for police report.`,

    legalSectionsPrompt: `Based on this incident description, suggest applicable IPC sections:

Description: {description}

Consider:
- Sexual harassment (354A)
- Stalking (354D)
- Assault (354, 323)
- Rape (375/376)
- Insult to modesty (509)
- Kidnapping (363, 366)
- Cyber crimes (IT Act)
- Domestic violence (DV Act 2005)

Provide relevant sections with brief explanation.`
  },

  // ============================================
  // RESPONSE TEMPLATES
  // ============================================
  
  responseTemplates: {
    acknowledgment: [
      "I understand. Let me help you with that.",
      "Thank you for sharing. I'm here to support you.",
      "I hear you. Let's work through this together."
    ],

    clarification: [
      "Could you provide more details about {topic}?",
      "To help you better, can you tell me more about {topic}?",
      "I want to make sure I understand - can you describe {topic}?"
    ],

    reassurance: [
      "You're doing the right thing by reaching out.",
      "Your safety is the priority. We'll figure this out together.",
      "It's okay to feel this way. Let's focus on keeping you safe."
    ],

    emergency: [
      "This is an emergency. Please call 112 or 100 immediately.",
      "Your safety is at risk. Call emergency services now: 112 (National) or 100 (Police).",
      "This requires immediate police help. Please call 112 right now."
    ],

    closure: [
      "Stay safe. I'm here anytime you need help.",
      "Remember, you can reach out anytime. Your safety matters.",
      "Take care of yourself. Don't hesitate to contact me again."
    ]
  },

  // ============================================
  // EVIDENCE LABELING PROMPTS
  // ============================================
  
  evidenceLabeling: {
    photoAnalysis: "Visual evidence available - photograph/image of incident scene or suspect",
    audioAnalysis: "Audio evidence available - recording of incident or threatening communication",
    textAnalysis: "Text evidence available - messages, emails, or written communication",
    locationAnalysis: "Location data available - GPS coordinates and timestamp",
    witnessAnalysis: "Witness testimony available - corroborating account from observer"
  },

  // ============================================
  // PSYCHOLOGICAL FIRST AID (TEXT-BASED)
  // ============================================
  
  psychologicalSupport: {
    immediateComfort: `I want you to know:

✓ You are safe right now
✓ What happened is not your fault
✓ Your feelings are valid
✓ You are not alone
✓ Help is available

Take a moment to breathe. You've taken a brave step by reaching out.`,

    copingStrategies: `Here are some things that might help right now:

**Grounding Technique (5-4-3-2-1):**
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

**Breathing:**
- Breathe in for 4 counts
- Hold for 4 counts
- Breathe out for 4 counts
- Repeat 4 times

Would you like to talk about what happened, or would you prefer practical next steps?`,

    longTermSupport: `Recovery takes time, and that's okay. Consider:

**Professional Support:**
- Counselor or therapist
- Support groups
- Women's organizations
- Mental health helplines

**Self-Care:**
- Talk to trusted people
- Maintain routines
- Physical activity
- Creative expression
- Journaling

**Resources:**
- Vandrevala Foundation: 1860-2662-345
- iCall: 9152987821
- NIMHANS: 080-46110007

You deserve support and healing.`
  },

  // ============================================
  // VOICE DETECTION (EXPLANATION - SIMULATED)
  // ============================================
  
  voiceDetection: {
    explanation: `**Voice Phrase Detection System (Architectural Concept)**

This feature would detect distress keywords in voice input:

**Trigger Phrases:**
- "Help me"
- "Emergency"
- "I'm in danger"
- "Someone is attacking me"
- Custom safe word

**System Flow:**
1. Continuous background listening (with permission)
2. Real-time speech-to-text processing
3. Keyword matching against distress database
4. Automatic severity classification
5. Trigger emergency protocols

**Actions Triggered:**
- Send SOS alerts to contacts
- Share live location
- Start audio/video recording
- Call emergency services
- Silent alarm to authorities

**Privacy:**
- Local processing only
- No cloud storage of audio
- User-controlled activation
- Encrypted communications

**Technical Stack:**
- Speech Recognition: Web Speech API / ML models
- Keyword Spotting: TensorFlow Lite
- Real-time Processing: Edge computing

*Note: This is a conceptual feature for demonstration purposes.*`
  }

};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get appropriate prompt based on context
 */
function getPrompt(category, subcategory = null) {
  if (subcategory) {
    return prompts[category]?.[subcategory] || null;
  }
  return prompts[category] || null;
}

/**
 * Fill template with dynamic data
 */
function fillTemplate(template, data) {
  let filled = template;
  for (const [key, value] of Object.entries(data)) {
    filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return filled;
}

/**
 * Get random response from array
 */
function getRandomResponse(responseArray) {
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

/**
 * Detect topic from user message
 */
function detectTopic(message) {
  const text = message.toLowerCase();
  const categories = prompts.safetyCoach.topicCategories;

  for (const [topic, data] of Object.entries(categories)) {
    if (data.keywords.some(keyword => text.includes(keyword))) {
      return { topic, response: data.response };
    }
  }

  return { topic: 'general', response: null };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  prompts,
  getPrompt,
  fillTemplate,
  getRandomResponse,
  detectTopic
};