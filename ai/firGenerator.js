// firGenerator.js - Generates FIR (First Information Report) Summary

const { config } = require('./config');

/**
 * Generates a structured FIR summary from incident data
 * @param {object} incidentData - All incident details
 * @returns {object} - Formatted FIR summary
 */
async function generateFIRSummary(incidentData) {
  try {
    // Validate required fields
    validateIncidentData(incidentData);

    const fir = {
      reportNumber: generateReportNumber(),
      generatedAt: new Date().toISOString(),
      status: 'DRAFT',
      
      // Basic Information
      complainant: {
        name: incidentData.name || '[Name]',
        age: incidentData.age || '[Age]',
        gender: incidentData.gender || 'Female',
        contact: incidentData.contact || '[Contact Number]',
        address: incidentData.address || '[Address]'
      },

      // Incident Details
      incident: {
        type: categorizeIncident(incidentData.description),
        dateTime: incidentData.dateTime || new Date().toISOString(),
        location: {
          address: incidentData.location || '[Location]',
          landmark: incidentData.landmark || 'N/A',
          area: incidentData.area || 'N/A',
          city: incidentData.city || 'N/A',
          state: incidentData.state || 'N/A',
          pincode: incidentData.pincode || 'N/A'
        },
        description: generateIncidentNarrative(incidentData)
      },

      // Suspect Information (if available)
      suspect: extractSuspectDetails(incidentData),

      // Evidence
      evidence: compileEvidence(incidentData),

      // Witness Information
      witnesses: incidentData.witnesses || [],

      // Injuries (if any)
      injuries: incidentData.injuries || 'None reported',

      // Legal Sections (Auto-suggested based on incident type)
      suggestedSections: suggestLegalSections(incidentData.description),

      // Summary
      summary: generateExecutiveSummary(incidentData),

      // Actions Taken
      actionsTaken: incidentData.actionsTaken || [],

      // Additional Notes
      additionalNotes: incidentData.notes || 'None'
    };

    return fir;

  } catch (error) {
    console.error('FIR Generation Error:', error);
    throw new Error('Failed to generate FIR summary');
  }
}

/**
 * Validate required fields in incident data
 */
function validateIncidentData(data) {
  const required = ['description'];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  return true;
}

/**
 * Generate unique report number
 */
function generateReportNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `FIR-${timestamp}-${random}`;
}

/**
 * Categorize incident type based on description
 */
function categorizeIncident(description) {
  const text = description.toLowerCase();

  const categories = {
    'Sexual Harassment': ['harass', 'touch', 'inappropriate', 'molest', 'grope', 'catcall', 'lewd'],
    'Physical Assault': ['assault', 'hit', 'punch', 'kick', 'beat', 'attack', 'injured'],
    'Stalking': ['stalk', 'follow', 'chase', 'watching', 'trailing'],
    'Threat/Intimidation': ['threat', 'intimidat', 'blackmail', 'coerce', 'force'],
    'Rape/Attempt to Rape': ['rape', 'sexual assault', 'forced'],
    'Domestic Violence': ['husband', 'family', 'domestic', 'home violence'],
    'Cybercrime': ['online', 'social media', 'cyber', 'internet', 'digital'],
    'Eve Teasing': ['eve teas', 'comment', 'whistle', 'gesture'],
    'Kidnapping/Abduction': ['kidnap', 'abduct', 'taken', 'forced into vehicle'],
    'Other': []
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'General Safety Concern';
}

/**
 * Generate detailed incident narrative
 */
function generateIncidentNarrative(data) {
  const parts = [];

  // Time and location
  if (data.dateTime) {
    const date = new Date(data.dateTime);
    parts.push(`On ${date.toLocaleDateString('en-IN')} at approximately ${date.toLocaleTimeString('en-IN')}`);
  }

  if (data.location) {
    parts.push(`at ${data.location}`);
  }

  // Main description
  parts.push(`\n\nIncident Description:\n${data.description}`);

  // Additional context
  if (data.isNight) parts.push('\n\nNote: Incident occurred during night hours.');
  if (data.isIsolated) parts.push('Location was isolated with minimal public presence.');
  if (data.witnesses && data.witnesses.length > 0) {
    parts.push(`\n\nWitnesses present: ${data.witnesses.length} person(s).`);
  }

  // Immediate actions
  if (data.actionsTaken && data.actionsTaken.length > 0) {
    parts.push(`\n\nImmediate Actions Taken:\n- ${data.actionsTaken.join('\n- ')}`);
  }

  return parts.join(' ');
}

/**
 * Extract suspect details from incident data
 */
function extractSuspectDetails(data) {
  if (!data.suspectInfo && !data.description) {
    return {
      identified: false,
      details: 'Suspect details not available'
    };
  }

  const suspect = {
    identified: data.suspectIdentified || false,
    name: data.suspectName || 'Unknown',
    age: data.suspectAge || 'Unknown',
    gender: data.suspectGender || 'Unknown',
    appearance: data.suspectAppearance || extractAppearanceFromDescription(data.description),
    vehicle: data.suspectVehicle || 'N/A',
    weapons: data.suspectWeapons || 'None reported',
    additionalInfo: data.suspectAdditionalInfo || 'N/A'
  };

  return suspect;
}

/**
 * Try to extract appearance details from description
 */
function extractAppearanceFromDescription(description) {
  const text = description.toLowerCase();
  const details = [];

  // Height indicators
  if (text.includes('tall')) details.push('Tall build');
  if (text.includes('short')) details.push('Short build');

  // Clothing
  if (text.includes('black shirt') || text.includes('dark clothes')) details.push('Dark clothing');
  if (text.includes('helmet')) details.push('Wearing helmet');
  if (text.includes('mask')) details.push('Face covered');

  // Age approximations
  if (text.includes('young')) details.push('Approximately 20-30 years');
  if (text.includes('middle aged')) details.push('Approximately 35-50 years');
  if (text.includes('old')) details.push('Approximately 50+ years');

  return details.length > 0 ? details.join(', ') : 'No clear description available';
}

/**
 * Compile all available evidence
 */
function compileEvidence(data) {
  const evidence = [];

  if (data.photos || data.hasPhotos) {
    evidence.push({
      type: 'Visual Evidence',
      description: 'Photographs/images of incident scene or suspect',
      available: true
    });
  }

  if (data.audio || data.hasAudio) {
    evidence.push({
      type: 'Audio Evidence',
      description: 'Audio recording of incident',
      available: true
    });
  }

  if (data.messages || data.hasMessages) {
    evidence.push({
      type: 'Text/Chat Evidence',
      description: 'Text messages or chat logs',
      available: true
    });
  }

  if (data.cctv || data.hasCCTV) {
    evidence.push({
      type: 'CCTV Footage',
      description: 'Available from location/nearby cameras',
      available: true
    });
  }

  if (data.medicalReport) {
    evidence.push({
      type: 'Medical Report',
      description: 'Medical examination report documenting injuries',
      available: true
    });
  }

  if (data.location) {
    evidence.push({
      type: 'Location Data',
      description: `GPS coordinates: ${data.location}`,
      available: true
    });
  }

  return evidence.length > 0 ? evidence : [{ type: 'None', description: 'No physical evidence available at this time', available: false }];
}

/**
 * Suggest relevant IPC sections based on incident
 */
function suggestLegalSections(description) {
  const text = description.toLowerCase();
  const sections = [];

  // Sexual harassment
  if (text.includes('harass') || text.includes('touch') || text.includes('inappropriate')) {
    sections.push('IPC Section 354A - Sexual Harassment');
    sections.push('IPC Section 509 - Word, gesture or act intended to insult modesty of a woman');
  }

  // Assault
  if (text.includes('assault') || text.includes('attack') || text.includes('hit')) {
    sections.push('IPC Section 354 - Assault or criminal force to woman with intent to outrage her modesty');
    sections.push('IPC Section 323 - Punishment for voluntarily causing hurt');
  }

  // Stalking
  if (text.includes('stalk') || text.includes('follow')) {
    sections.push('IPC Section 354D - Stalking');
  }

  // Rape/Sexual assault
  if (text.includes('rape') || text.includes('sexual assault')) {
    sections.push('IPC Section 375/376 - Rape');
    sections.push('IPC Section 354 - Assault on woman with intent to outrage her modesty');
  }

  // Kidnapping
  if (text.includes('kidnap') || text.includes('abduct')) {
    sections.push('IPC Section 363 - Kidnapping');
    sections.push('IPC Section 366 - Kidnapping, abducting or inducing woman to compel her marriage');
  }

  // Domestic violence
  if (text.includes('domestic') || text.includes('husband') || text.includes('family')) {
    sections.push('Protection of Women from Domestic Violence Act, 2005');
  }

  // Cyber crime
  if (text.includes('online') || text.includes('cyber') || text.includes('social media')) {
    sections.push('IT Act Section 66E - Violation of privacy');
    sections.push('IPC Section 354C - Voyeurism');
  }

  return sections.length > 0 ? sections : ['To be determined based on investigation'];
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(data) {
  const incidentType = categorizeIncident(data.description);
  const severity = data.severity || 'MEDIUM';
  const location = data.location || 'undisclosed location';

  let summary = `This is a ${severity} severity incident of ${incidentType} that occurred at ${location}. `;
  
  summary += `The complainant has reported: ${data.description.substring(0, 150)}${data.description.length > 150 ? '...' : ''}. `;

  if (data.actionsTaken && data.actionsTaken.length > 0) {
    summary += `Immediate actions taken include: ${data.actionsTaken.join(', ')}. `;
  }

  summary += 'Further investigation required.';

  return summary;
}

/**
 * Generate downloadable FIR document (plain text format)
 */
function generateFIRDocument(firSummary) {
  let document = '';
  
  document += '═══════════════════════════════════════════════════\n';
  document += '           FIRST INFORMATION REPORT (FIR)          \n';
  document += '═══════════════════════════════════════════════════\n\n';
  
  document += `Report Number: ${firSummary.reportNumber}\n`;
  document += `Generated: ${new Date(firSummary.generatedAt).toLocaleString('en-IN')}\n`;
  document += `Status: ${firSummary.status}\n\n`;
  
  document += '─────────────────────────────────────────────────\n';
  document += 'COMPLAINANT DETAILS\n';
  document += '─────────────────────────────────────────────────\n';
  document += `Name: ${firSummary.complainant.name}\n`;
  document += `Age: ${firSummary.complainant.age}\n`;
  document += `Gender: ${firSummary.complainant.gender}\n`;
  document += `Contact: ${firSummary.complainant.contact}\n`;
  document += `Address: ${firSummary.complainant.address}\n\n`;
  
  document += '─────────────────────────────────────────────────\n';
  document += 'INCIDENT DETAILS\n';
  document += '─────────────────────────────────────────────────\n';
  document += `Type: ${firSummary.incident.type}\n`;
  document += `Date & Time: ${new Date(firSummary.incident.dateTime).toLocaleString('en-IN')}\n`;
  document += `Location: ${firSummary.incident.location.address}\n`;
  document += `\nDescription:\n${firSummary.incident.description}\n\n`;
  
  document += '─────────────────────────────────────────────────\n';
  document += 'SUSPECT INFORMATION\n';
  document += '─────────────────────────────────────────────────\n';
  document += `Identified: ${firSummary.suspect.identified ? 'Yes' : 'No'}\n`;
  document += `Name: ${firSummary.suspect.name}\n`;
  document += `Appearance: ${firSummary.suspect.appearance}\n`;
  document += `Vehicle: ${firSummary.suspect.vehicle}\n\n`;
  
  document += '─────────────────────────────────────────────────\n';
  document += 'EVIDENCE\n';
  document += '─────────────────────────────────────────────────\n';
  firSummary.evidence.forEach((ev, idx) => {
    document += `${idx + 1}. ${ev.type}: ${ev.description}\n`;
  });
  document += '\n';
  
  document += '─────────────────────────────────────────────────\n';
  document += 'SUGGESTED LEGAL SECTIONS\n';
  document += '─────────────────────────────────────────────────\n';
  firSummary.suggestedSections.forEach((section, idx) => {
    document += `${idx + 1}. ${section}\n`;
  });
  document += '\n';
  
  document += '─────────────────────────────────────────────────\n';
  document += 'SUMMARY\n';
  document += '─────────────────────────────────────────────────\n';
  document += `${firSummary.summary}\n\n`;
  
  document += '═══════════════════════════════════════════════════\n';
  document += 'Note: This is a computer-generated draft. Please verify\n';
  document += 'all details before submitting to authorities.\n';
  document += '═══════════════════════════════════════════════════\n';
  
  return document;
}

// Export functions
module.exports = {
  generateFIRSummary,
  generateFIRDocument,
  categorizeIncident,
  suggestLegalSections
};