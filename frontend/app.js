// GuardHer AI Safety Dashboard - JavaScript
// Handles all interactivity, AI analysis, and dynamic updates

// ===========================
// SAMPLE DATA
// ===========================

// Sample alerts data for demonstration
const alertsData = [
    {
        time: '2 hours ago',
        message: 'You look amazing in that photo, can we meet up?',
        risk: 'high',
        id: 1
    },
    {
        time: '5 hours ago',
        message: 'Can we meet somewhere private to discuss this?',
        risk: 'warning',
        id: 2
    },
    {
        time: '1 day ago',
        message: 'Thanks for the book recommendation! Really enjoying it.',
        risk: 'safe',
        id: 3
    },
    {
        time: '2 days ago',
        message: 'Why aren\'t you responding to me? I saw you were online.',
        risk: 'warning',
        id: 4
    },
    {
        time: '3 days ago',
        message: 'I know where you live and what time you get home.',
        risk: 'high',
        id: 5
    }
];

// ===========================
// INITIALIZE APP
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Render initial alerts table
    renderAlerts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize overview stats
    updateOverviewStats();
});

// ===========================
// RENDER ALERTS TABLE
// ===========================

function renderAlerts() {
    const tbody = document.getElementById('alertsTableBody');
    
    // Clear existing content
    tbody.innerHTML = '';

    // Render each alert
    alertsData.forEach((alert, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors slide-in';
        row.style.animationDelay = `${index * 0.05}s`;

        // Determine risk badge styling
        let riskBadge = '';
        if (alert.risk === 'high') {
            riskBadge = '<span class="px-3 py-1 gradient-risk text-red-700 text-xs font-semibold rounded-full">High Priority</span>';
        } else if (alert.risk === 'warning') {
            riskBadge = '<span class="px-3 py-1 gradient-warning text-yellow-700 text-xs font-semibold rounded-full">Review Needed</span>';
        } else {
            riskBadge = '<span class="px-3 py-1 gradient-safe text-green-700 text-xs font-semibold rounded-full">Safe</span>';
        }

        // Build row HTML
        row.innerHTML = `
            <td class="py-4 px-4 text-sm text-gray-600">${alert.time}</td>
            <td class="py-4 px-4 text-sm text-gray-800">${alert.message}</td>
            <td class="py-4 px-4">${riskBadge}</td>
            <td class="py-4 px-4">
                <button class="view-detail-btn text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors" data-id="${alert.id}">
                    View Details
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Add event listeners to "View Details" buttons
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const alertId = this.getAttribute('data-id');
            viewAlertDetails(alertId);
        });
    });
}

// ===========================
// UPDATE OVERVIEW STATISTICS
// ===========================

function updateOverviewStats() {
    // Count alerts by risk level
    const safeCount = alertsData.filter(a => a.risk === 'safe').length;
    const warningCount = alertsData.filter(a => a.risk === 'warning').length;
    const riskCount = alertsData.filter(a => a.risk === 'high').length;

    // Update DOM (with animation)
    animateCount('safeCount', 847);
    animateCount('warningCount', 23);
    animateCount('riskCount', 3);
}

// Animate number counting up
function animateCount(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// ===========================
// EVENT LISTENERS SETUP
// ===========================

function setupEventListeners() {
    // SOS Button
    const sosButton = document.getElementById('sosButton');
    sosButton.addEventListener('click', handleSOSClick);

    // Analyze Message Button
    const analyzeButton = document.getElementById('analyzeButton');
    analyzeButton.addEventListener('click', handleAnalyzeMessage);

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
}

// ===========================
// SOS BUTTON HANDLER
// Triggers emergency alert
// ===========================

async function handleSOSClick() {
    // Show loading state
    const sosButton = document.getElementById('sosButton');
    sosButton.classList.add('loading');

    // Simulate API call to emergency service
    try {
        // In a real app, this would:
        // 1. Send GPS location to emergency contacts
        // 2. Trigger emergency services notification
        // 3. Start recording/logging
        // 4. Alert support team
        
        await simulateAPICall('/emergency/sos', {
            timestamp: new Date().toISOString(),
            location: 'User location here',
            userId: 'user123'
        });

        // Show success message
        showNotification(
            '🚨 Emergency SOS Activated',
            'Help is on the way. Your emergency contacts have been notified.\n\nStay safe. You are not alone.\n\nEmergency services: 911\nDomestic Violence Hotline: 1-800-799-7233',
            'warning'
        );

        // Add new alert to the table
        addNewAlert({
            time: 'Just now',
            message: 'Emergency SOS triggered',
            risk: 'high',
            id: Date.now()
        });

    } catch (error) {
        console.error('SOS Error:', error);
        showNotification('Error', 'Could not send emergency alert. Please call 911 directly.', 'error');
    } finally {
        sosButton.classList.remove('loading');
    }
}

// ===========================
// MESSAGE ANALYSIS HANDLER
// Analyzes message for safety concerns
// ===========================

async function handleAnalyzeMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    // Validate input
    if (!message) {
        showNotification('Input Required', 'Please enter a message to analyze.', 'info');
        return;
    }

    // Show analyzing state
    const analyzeButton = document.getElementById('analyzeButton');
    const resultDiv = document.getElementById('analysisResult');
    
    analyzeButton.classList.add('loading');
    analyzeButton.disabled = true;
    
    resultDiv.innerHTML = `
        <div class="text-center text-gray-500 py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
            <p>Analyzing message for safety concerns...</p>
        </div>
    `;
    resultDiv.classList.remove('hidden');

    try {
        // Simulate API call to AI analysis endpoint
        const analysisResult = await analyzeMessageWithAI(message);

        // Display results
        displayAnalysisResult(analysisResult);

        // Add to alerts if concerning
        if (analysisResult.riskLevel !== 'safe') {
            addNewAlert({
                time: 'Just now',
                message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                risk: analysisResult.riskLevel,
                id: Date.now()
            });
        }

    } catch (error) {
        console.error('Analysis Error:', error);
        resultDiv.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p class="text-red-700">Error analyzing message. Please try again.</p>
            </div>
        `;
    } finally {
        analyzeButton.classList.remove('loading');
        analyzeButton.disabled = false;
    }
}

// ===========================
// AI MESSAGE ANALYSIS
// Simulates AI-powered risk assessment
// ===========================

async function analyzeMessageWithAI(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Enhanced keyword-based analysis (in real app, use ML model)
    const messageLower = message.toLowerCase();
    
    // Define comprehensive keyword patterns
    const highRiskPatterns = {
        keywords: ['meet up', 'meet me', 'private', 'know where you live', 'know where you work', 
                   'alone', 'secret', 'don\'t tell', 'send nudes', 'send pics', 'picture of you',
                   'threatening', 'hurt you', 'kill you', 'regret', 'or else', 'watch out',
                   'following you', 'stalking', 'obsessed', 'belong to me', 'mine forever'],
        score: 85
    };
    
    const warningPatterns = {
        keywords: ['why aren\'t you', 'ignoring me', 'saw you online', 'need to talk', 'urgent',
                   'answer me', 'respond', 'pick up', 'call me back', 'where are you',
                   'who are you with', 'prove it', 'show me', 'suspicious', 'don\'t believe',
                   'controlling', 'jealous', 'upset with you', 'disappointed'],
        score: 55
    };

    const manipulationPatterns = {
        keywords: ['you owe me', 'after everything', 'ungrateful', 'nobody else', 'lucky to have',
                   'without me', 'you\'ll regret', 'you\'re overreacting', 'too sensitive',
                   'crazy', 'you\'re imagining', 'never happened', 'gaslighting'],
        score: 70
    };

    const intrusivePatterns = {
        keywords: ['send me', 'share your location', 'password', 'pin code', 'bank',
                   'credit card', 'social security', 'home address', 'work address',
                   'live alone', 'when will you be home', 'schedule', 'routine'],
        score: 75
    };

    // Check message length for context
    const isShort = message.length < 20;
    const isLong = message.length > 200;

    // Check for high risk patterns
    for (let keyword of highRiskPatterns.keywords) {
        if (messageLower.includes(keyword)) {
            return {
                riskLevel: 'high',
                riskScore: highRiskPatterns.score + Math.floor(Math.random() * 10),
                concerns: [
                    'Potential manipulation or coercion detected',
                    'Request for private meeting or location sharing',
                    'Pattern matches known harassment tactics',
                    'Language suggests boundary violations'
                ],
                recommendations: [
                    'Do not respond to this message',
                    'Block this contact immediately',
                    'Document and report to authorities if needed',
                    'Share with a trusted friend or family member',
                    'Consider filing a police report if threats are present'
                ]
            };
        }
    }

    // Check for manipulation patterns
    for (let keyword of manipulationPatterns.keywords) {
        if (messageLower.includes(keyword)) {
            return {
                riskLevel: 'high',
                riskScore: manipulationPatterns.score + Math.floor(Math.random() * 10),
                concerns: [
                    'Emotional manipulation detected',
                    'Gaslighting or blame-shifting language',
                    'Attempts to undermine your judgment',
                    'Classic manipulation tactics identified'
                ],
                recommendations: [
                    'Recognize this as manipulative behavior',
                    'Do not engage or try to defend yourself',
                    'Set firm boundaries or cut contact',
                    'Seek support from trusted friends/family',
                    'Consider speaking with a counselor'
                ]
            };
        }
    }

    // Check for intrusive patterns
    for (let keyword of intrusivePatterns.keywords) {
        if (messageLower.includes(keyword)) {
            return {
                riskLevel: 'high',
                riskScore: intrusivePatterns.score + Math.floor(Math.random() * 10),
                concerns: [
                    'Request for sensitive personal information',
                    'Privacy invasion attempt detected',
                    'Potential identity theft or fraud risk',
                    'Inappropriate information request'
                ],
                recommendations: [
                    'Never share personal/financial information',
                    'Do not respond to this request',
                    'Block and report this contact',
                    'Monitor your accounts for suspicious activity',
                    'Report to relevant authorities if needed'
                ]
            };
        }
    }

    // Check for warning signs
    for (let keyword of warningPatterns.keywords) {
        if (messageLower.includes(keyword)) {
            return {
                riskLevel: 'warning',
                riskScore: warningPatterns.score + Math.floor(Math.random() * 10),
                concerns: [
                    'Potential boundary violation detected',
                    'May indicate controlling behavior',
                    'Demanding or pressuring language used',
                    'Pattern suggests lack of respect for your autonomy'
                ],
                recommendations: [
                    'Set clear boundaries in your response',
                    'Monitor for escalating behavior',
                    'Trust your instincts about this interaction',
                    'Consider discussing with someone you trust',
                    'Document this message for your records'
                ]
            };
        }
    }

    // Check for excessive punctuation or caps (aggressive communication)
    const hasExcessivePunctuation = (message.match(/[!?]{2,}/g) || []).length > 0;
    const hasExcessiveCaps = message.match(/[A-Z]{5,}/g);
    
    if (hasExcessivePunctuation || hasExcessiveCaps) {
        return {
            riskLevel: 'warning',
            riskScore: 45 + Math.floor(Math.random() * 15),
            concerns: [
                'Aggressive communication style detected',
                'Excessive punctuation or capitalization',
                'May indicate heightened emotional state',
                'Communication lacks respect or calmness'
            ],
            recommendations: [
                'Consider whether this conversation is productive',
                'You have the right to disengage from aggressive communication',
                'Set boundaries about respectful communication',
                'Take a break from this conversation if needed',
                'Don\'t feel obligated to respond immediately'
            ]
        };
    }

    // If message is suspiciously vague or generic
    if (isShort && (messageLower.includes('hey') || messageLower.includes('hi') || 
        messageLower.includes('hello')) && message.includes('...')) {
        return {
            riskLevel: 'warning',
            riskScore: 35,
            concerns: [
                'Vague or non-specific message',
                'May be testing your responsiveness',
                'Could be attempting to re-establish contact'
            ],
            recommendations: [
                'You\'re not obligated to respond to vague messages',
                'Trust your instincts about this contact',
                'Consider the history of this relationship',
                'It\'s okay to not respond if you feel uncomfortable'
            ]
        };
    }

    // Message appears safe - friendly, polite, specific
    const safeIndicators = ['thank', 'appreciate', 'hope you', 'how are you', 'nice to', 
                            'loved', 'enjoyed', 'great to', 'wonderful', 'happy',
                            'question about', 'wondering if', 'would you like'];
    
    for (let indicator of safeIndicators) {
        if (messageLower.includes(indicator)) {
            return {
                riskLevel: 'safe',
                riskScore: 10 + Math.floor(Math.random() * 10),
                concerns: [],
                recommendations: [
                    'Message appears to be safe and respectful',
                    'Communication shows positive and friendly intent',
                    'Continue normal conversation if comfortable',
                    'Always trust your instincts',
                    'You can respond at your own pace'
                ]
            };
        }
    }

    // Default safe response for neutral/unclear messages
    return {
        riskLevel: 'safe',
        riskScore: 20 + Math.floor(Math.random() * 15),
        concerns: [],
        recommendations: [
            'Message appears to be neutral or safe',
            'No obvious red flags detected',
            'Continue conversation if you feel comfortable',
            'Always trust your instincts about any interaction',
            'Monitor for any changes in communication patterns'
        ]
    };
}

// ===========================
// DISPLAY ANALYSIS RESULT
// Shows AI analysis in friendly format
// ===========================

function displayAnalysisResult(result) {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.classList.add('result-highlight');

    let resultHTML = '';

    // High Risk Result
    if (result.riskLevel === 'high') {
        resultHTML = `
            <div class="gradient-risk rounded-xl p-6">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-red-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-xl font-bold text-red-800 mb-2">🚨 High Priority Alert</h4>
                        <p class="text-red-700 mb-4">Risk Score: ${result.riskScore}/100</p>
                        
                        <div class="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                            <h5 class="font-semibold text-red-900 mb-2">Concerns Identified:</h5>
                            <ul class="list-disc list-inside space-y-1 text-red-800 text-sm">
                                ${result.concerns.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="bg-white bg-opacity-50 rounded-lg p-4">
                            <h5 class="font-semibold text-red-900 mb-2">Recommended Actions:</h5>
                            <ul class="list-disc list-inside space-y-1 text-red-800 text-sm">
                                ${result.recommendations.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // Warning Result
    else if (result.riskLevel === 'warning') {
        resultHTML = `
            <div class="gradient-warning rounded-xl p-6">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-xl font-bold text-yellow-800 mb-2">⚠️ Potential Concern</h4>
                        <p class="text-yellow-700 mb-4">Risk Score: ${result.riskScore}/100</p>
                        
                        <div class="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                            <h5 class="font-semibold text-yellow-900 mb-2">Areas of Concern:</h5>
                            <ul class="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                                ${result.concerns.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="bg-white bg-opacity-50 rounded-lg p-4">
                            <h5 class="font-semibold text-yellow-900 mb-2">Suggestions:</h5>
                            <ul class="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                                ${result.recommendations.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // Safe Result
    else {
        resultHTML = `
            <div class="gradient-safe rounded-xl p-6">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-xl font-bold text-green-800 mb-2">✅ Message Appears Safe</h4>
                        <p class="text-green-700 mb-4">Risk Score: ${result.riskScore}/100</p>
                        
                        <div class="bg-white bg-opacity-50 rounded-lg p-4">
                            <h5 class="font-semibold text-green-900 mb-2">Analysis:</h5>
                            <ul class="list-disc list-inside space-y-1 text-green-800 text-sm">
                                ${result.recommendations.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.remove('hidden');

    // Remove highlight animation after it completes
    setTimeout(() => {
        resultDiv.classList.remove('result-highlight');
    }, 1000);
}

// ===========================
// ADD NEW ALERT
// Dynamically adds alert to table
// ===========================

function addNewAlert(alert) {
    // Add to beginning of alerts array
    alertsData.unshift(alert);

    // Re-render table
    renderAlerts();

    // Update stats
    updateOverviewStats();

    // Show notification
    showNotification('New Alert', 'A new alert has been added to your dashboard.', 'info');
}

// ===========================
// VIEW ALERT DETAILS
// Shows detailed view of an alert
// ===========================

function viewAlertDetails(alertId) {
    const alert = alertsData.find(a => a.id == alertId);
    
    if (!alert) {
        showNotification('Error', 'Alert not found.', 'error');
        return;
    }

    // In a real app, this would open a modal or navigate to detail page
    const detailMessage = `
Alert Details:
━━━━━━━━━━━━━━━━━━━━
Time: ${alert.time}
Message: ${alert.message}
Risk Level: ${alert.risk.toUpperCase()}
Alert ID: ${alert.id}

Actions Available:
• Block sender
• Report to authorities
• Add to monitored contacts
• Export evidence
    `;

    showNotification('Alert Details', detailMessage, 'info');
}

// ===========================
// NAVIGATION HANDLER
// ===========================

function handleNavClick(e) {
    e.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'bg-white', 'shadow-sm');
    });

    // Add active class to clicked item
    e.currentTarget.classList.add('active', 'bg-white', 'shadow-sm');

    // Get target section from href
    const href = e.currentTarget.getAttribute('href');
    const sectionId = href.replace('#', '') + '-section';

    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active-section');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    console.log('Navigated to:', sectionId);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Simulate API call with delay
function simulateAPICall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`API Call to ${endpoint}:`, data);
            resolve({ success: true, data });
        }, 1000);
    });
}

// Show notification (using alert for now, can be replaced with toast)
function showNotification(title, message, type = 'info') {
    // In a real app, use a toast library or custom modal
    alert(`${title}\n\n${message}`);
}

// ===========================
// EXPORT FUNCTIONS
// For use in other modules if needed
// ===========================

// Make functions available globally if needed
window.GuardHer = {
    renderAlerts,
    updateOverviewStats,
    handleSOSClick,
    handleAnalyzeMessage,
    addNewAlert,
    viewAlertDetails
};