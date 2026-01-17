// Centralized configuration for the backend project
const config = {
  // Server port
  PORT: 3000,

  // Type of database (e.g., "D1", "SQLite", "MongoDB")
  DB_TYPE: "D1",

  // Placeholder connection string for the database
  DB_CONNECTION_STRING: "your-database-connection-string",

  // Placeholder token for admin routes authentication
  ADMIN_TOKEN: "your-admin-token",

  // AIService thresholds configuration
  AI_CONFIG: {
    imageRiskThreshold: 0.7, // Threshold for image risk detection
    audioRiskThreshold: 0.6  // Threshold for audio risk detection
  },

  // Enable or disable console logging
  LOGGING_ENABLED: true,

  // Environment setting: "development" or "production"
  ENVIRONMENT: "development",

  // Logging level: "info", "debug", "error"
  LOG_LEVEL: "info",

  // SMS/WhatsApp gateway API key placeholder
  SMS_GATEWAY_API_KEY: "your-sms-gateway-api-key",

  // SMS/WhatsApp gateway URL placeholder
  SMS_GATEWAY_URL: "https://your-sms-gateway-url.com/api",

  // Email service SMTP settings placeholder
  EMAIL_SERVICE: {
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: 587,
    SMTP_USER: "your-email@example.com",
    SMTP_PASS: "your-email-password"
  },

  // Maximum upload size in bytes (e.g., for evidence files)
  MAX_UPLOAD_SIZE: 10485760, // 10 MB

  // Secret key for JWT token-based authentication
  JWT_SECRET: "your-jwt-secret",

  // Default number of items per page for API pagination
  DEFAULT_PAGE_LIMIT: 20
};

module.exports = config;
