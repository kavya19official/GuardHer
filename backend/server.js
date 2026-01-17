// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

// Import routes
const sosRoutes = require('./routes/sos');
const analyzeRoutes = require('./routes/analyze');

// Create Express app
const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Optional: simple logging
if (config.LOGGING_ENABLED) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ===================== ROUTES =====================
app.use('/sos', sosRoutes);         // SOS workflow routes
app.use('/analyze', analyzeRoutes); // Analytics dashboard routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ===================== START SERVER =====================
const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`GuardHer backend running on port ${PORT}`);
});