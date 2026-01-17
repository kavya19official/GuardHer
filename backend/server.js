

// Main server entry point for GuardHer backend
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const sosRoutes = require('./routes/sos');
const analyzeRoutes = require('./routes/analyze');

// Use routes
app.use('/api/sos', sosRoutes);
app.use('/api/analyze', analyzeRoutes);

// Import config for port
const config = require('./config');
const PORT = config.port || 3000;

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`GuardHer backend server running on port ${PORT}`);
});