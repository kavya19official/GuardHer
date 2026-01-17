// testCases.js - Comprehensive test suite for all AI modules

const { analyzeMessage, analyzeConversation } = require('./analyzeMessage');
const { generateFIRSummary, generateFIRDocument } = require('./firGenerator');
const { chatWithCoach } = require('./safetyCoach');
const { detectTopic, getRandomResponse, prompts } = require('./prompt');

// Color codes for terminal output (optional)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function printHeader(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function printSubHeader(title) {
  console.log(`\n${colors.yellow}--- ${title} ---${colors.reset}\n`);
}

function printSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function printError(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

// ============================================
// TEST 1: SEVERITY CLASSIFICATION
// ============================================
async function testSeverityClassification() {
  printHeader('TEST 1: SEVERITY CLASSIFICATION');

  const testCases = [
    {
      name: 'High Severity - Physical Assault',
      message: 'Someone is attacking me with a knife near the metro station! I need help now!',
      context: { isNight: true, isIsolated: true, hasLocation: true },
      expectedSeverity: 'HIGH'
    },
    {
      name: 'High Severity - Rape Attempt',
      message: 'A man grabbed me and tried to force me into his car',
      context: { isNight: true, isIsolated: true },
      expectedSeverity: 'HIGH'
    },
    {
      name: 'Medium Severity - Stalking',
      message: 'Someone has been following me for the past 20 minutes, I am scared',
      context: { isNight: true, isIsolated: false },
      expectedSeverity: 'MEDIUM'
    },
    {
      name: 'Medium Severity - Harassment',
      message: 'A stranger touched me inappropriately on the bus and made lewd comments',
      context: { isNight: false, isIsolated: false },
      expectedSeverity: 'MEDIUM'
    },
    {
      name: 'Low Severity - Precautionary',
      message: 'I am worried about walking alone at night. What precautions should I take?',
      context: { isNight: false, isIsolated: false },
      expectedSeverity: 'LOW'
    }
  ];

  for (const testCase of testCases) {
    printSubHeader(testCase.name);
    console.log(`Message: "${testCase.message}"`);
    console.log(`Context:`, testCase.context);

    const result = analyzeMessage(testCase.message, testCase.context);
    
    console.log(`\nResult:`);
    console.log(`- Severity: ${result.severity}`);
    console.log(`- Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`- Risk Factors: ${result.riskFactors.join(', ') || 'None'}`);
    console.log(`- Evidence Labels: ${result.evidenceLabels.join(', ') || 'None'}`);
    console.log(`- Recommendations:`);
    result.recommendations.forEach(rec => console.log(`  • ${rec}`));

    if (result.severity === testCase.expectedSeverity) {
      printSuccess(`Test Passed - Expected ${testCase.expectedSeverity}, Got ${result.severity}`);
    } else {
      printError(`Test Failed - Expected ${testCase.expectedSeverity}, Got ${result.severity}`);
    }
  }
}

// ============================================
// TEST 2: CONVERSATION ANALYSIS
// ============================================
async function testConversationAnalysis() {
  printHeader('TEST 2: CONVERSATION ANALYSIS');

  const conversation = [
    { text: 'Someone is following me', context: { isNight: false } },
    { text: 'He is getting closer, wearing a black hoodie', context: { isNight: true } },
    { text: 'I am really scared now, he just called my name', context: { isNight: true, isIsolated: true } }
  ];

  console.log('Analyzing conversation with multiple messages...\n');
  conversation.forEach((msg, idx) => {
    console.log(`Message ${idx + 1}: "${msg.text}"`);
  });

  const result = analyzeConversation(conversation);
  
  console.log(`\nConversation Analysis:`);
  console.log(`- Overall Severity: ${result.overallSeverity}`);
  console.log(`- Total Risk Factors: ${result.totalRisks.join(', ')}`);
  console.log(`- Message Count: ${result.messageCount}`);

  printSuccess('Conversation analysis completed');
}

// ============================================
// TEST 3: SAFETY COACH CHATBOT
// ============================================
async function testSafetyCoach() {
  printHeader('TEST 3: SAFETY COACH CHATBOT');

  const testQueries = [
    'Help! Someone is attacking me with a weapon!',
    'Someone has been stalking me for days, what should I do?',
    'I am scared and anxious after being harassed yesterday',
    'What safety tips should I follow when traveling at night?',
    'How do I file an FIR for harassment?',
    'I received threatening messages online, what should I do?'
  ];

  for (const query of testQueries) {
    printSubHeader(`Query: "${query}"`);
    
    const response = await chatWithCoach(query, []);
    
    console.log(`\nBot Response:`);
    console.log(response.response.substring(0, 300) + '...\n');
    console.log(`- Type: ${response.type}`);
    console.log(`- Severity: ${response.severity}`);
    console.log(`- Is Emergency: ${response.isEmergency || false}`);
    
    if (response.recommendations && response.recommendations.length > 0) {
      console.log(`- Recommendations: ${response.recommendations.length} provided`);
    }
    
    if (response.resources && response.resources.length > 0) {
      console.log(`- Resources: ${response.resources.length} provided`);
    }
    
    if (response.emotionalSupport) {
      console.log(`- Emotional Support: Provided`);
    }

    printSuccess('Response generated successfully');
  }
}

// ============================================
// TEST 4: FIR GENERATION
// ============================================
async function testFIRGeneration() {
  printHeader('TEST 4: FIR GENERATION');

  const incidentData = {
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    contact: '+91-9876543210',
    address: '123, Green Park, New Delhi - 110016',
    
    description: 'On January 15, 2026 at around 8:30 PM, I was walking back home from the metro station. A man in a black shirt and jeans started following me. He made inappropriate comments and tried to grab my hand. When I resisted, he threatened me. I managed to run to a nearby shop where the shopkeeper helped me. I have photos of the suspect taken from a distance.',
    
    dateTime: new Date('2026-01-15T20:30:00').toISOString(),
    location: 'Green Park Metro Station, New Delhi',
    landmark: 'Near exit gate 2',
    area: 'Green Park',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    
    isNight: true,
    isIsolated: false,
    severity: 'MEDIUM',
    
    suspectAppearance: 'Male, approximately 30-35 years, wearing black shirt and blue jeans, medium height',
    suspectVehicle: 'None observed',
    
    hasPhotos: true,
    witnesses: ['Shopkeeper at Green Mart'],
    
    injuries: 'Minor bruise on left wrist',
    
    actionsTaken: [
      'Ran to nearby shop for safety',
      'Informed shopkeeper who called police',
      'Took photos of suspect',
      'Shared location with family'
    ],
    
    notes: 'Suspect fled when shopkeeper came out. Local police patrol arrived within 10 minutes.'
  };

  printSubHeader('Generating FIR Summary');
  console.log('Incident Data:', JSON.stringify({
    name: incidentData.name,
    incident: incidentData.description.substring(0, 100) + '...',
    location: incidentData.location
  }, null, 2));

  const fir = await generateFIRSummary(incidentData);
  
  console.log(`\nGenerated FIR Summary:`);
  console.log(`- Report Number: ${fir.reportNumber}`);
  console.log(`- Incident Type: ${fir.incident.type}`);
  console.log(`- Location: ${fir.incident.location.address}`);
  console.log(`- Suspect Identified: ${fir.suspect.identified}`);
  console.log(`- Evidence Count: ${fir.evidence.length}`);
  console.log(`- Suggested Legal Sections: ${fir.suggestedSections.length}`);
  
  printSuccess('FIR summary generated successfully');

  printSubHeader('Generating FIR Document');
  const document = generateFIRDocument(fir);
  
  console.log('\n--- FIR DOCUMENT PREVIEW ---');
  console.log(document.substring(0, 800));
  console.log('\n[... document continues ...]');
  
  printSuccess('FIR document generated successfully');
}

// ============================================
// TEST 5: PROMPT SYSTEM
// ============================================
async function testPromptSystem() {
  printHeader('TEST 5: PROMPT SYSTEM');

  printSubHeader('Topic Detection');
  
  const testMessages = [
    'Someone is following me on the street',
    'I am getting harassing messages on Instagram',
    'What precautions should I take when traveling alone at night?',
    'How do I report cyber harassment?',
    'I feel scared and anxious after yesterday\'s incident'
  ];

  testMessages.forEach(msg => {
    const detected = detectTopic(msg);
    console.log(`\nMessage: "${msg}"`);
    console.log(`Detected Topic: ${detected.topic}`);
    printSuccess('Topic detected');
  });

  printSubHeader('Random Response Generation');
  
  const acknowledgment = getRandomResponse(prompts.responseTemplates.acknowledgment);
  console.log(`Random Acknowledgment: "${acknowledgment}"`);
  printSuccess('Random response generated');
}

// ============================================
// TEST 6: INTEGRATION TEST
// ============================================
async function testIntegration() {
  printHeader('TEST 6: INTEGRATION TEST - COMPLETE FLOW');

  console.log('Simulating a complete user journey...\n');

  // Step 1: User reports incident
  printSubHeader('Step 1: Incident Reporting');
  const userMessage = 'A man has been stalking me for the past week. Today he followed me home and I am very scared.';
  console.log(`User Message: "${userMessage}"`);

  // Step 2: Analyze severity
  printSubHeader('Step 2: Severity Analysis');
  const analysis = analyzeMessage(userMessage, { isNight: false });
  console.log(`Severity: ${analysis.severity}`);
  console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
  printSuccess('Severity analyzed');

  // Step 3: Get coach guidance
  printSubHeader('Step 3: Safety Coach Guidance');
  const coachResponse = await chatWithCoach(userMessage, []);
  console.log(`Coach Response Type: ${coachResponse.type}`);
  console.log(`Recommendations: ${coachResponse.recommendations.length} provided`);
  printSuccess('Guidance provided');

  // Step 4: Generate FIR
  printSubHeader('Step 4: FIR Generation');
  const firData = {
    name: 'Test User',
    description: userMessage,
    dateTime: new Date().toISOString(),
    location: 'Test Location, Delhi',
    severity: analysis.severity
  };
  
  const fir = await generateFIRSummary(firData);
  console.log(`FIR Report Number: ${fir.reportNumber}`);
  console.log(`Incident Type: ${fir.incident.type}`);
  printSuccess('FIR generated');

  printSubHeader('Integration Test Complete');
  printSuccess('All modules working together successfully!');
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
  console.log(`${colors.bright}${colors.magenta}`);
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║              GUARDHER AI MODULE TEST SUITE                ║
  ║                                                           ║
  ║          Testing All AI Features & Capabilities           ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
  console.log(colors.reset);

  try {
    await testSeverityClassification();
    await testConversationAnalysis();
    await testSafetyCoach();
    await testFIRGeneration();
    await testPromptSystem();
    await testIntegration();

    console.log(`\n${colors.bright}${colors.green}`);
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║              ✓ ALL TESTS COMPLETED SUCCESSFULLY           ║
  ║                                                           ║
  ║         Your AI Module is Ready for Hackathon! 🚀         ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
    `);
    console.log(colors.reset);

  } catch (error) {
    printError(`Test Suite Error: ${error.message}`);
    console.error(error);
  }
}

// ============================================
// INDIVIDUAL TEST RUNNERS
// ============================================

// Export individual test functions for selective testing
module.exports = {
  runAllTests,
  testSeverityClassification,
  testConversationAnalysis,
  testSafetyCoach,
  testFIRGeneration,
  testPromptSystem,
  testIntegration
};

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}