const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const orderModel = require('./models/orderModel');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables
const initDb = async () => {
  try {
    await orderModel.createShipmentTable();
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    process.exit(1);
  }
};

// API Routes
app.use('/api/v1/order', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Initialize database and start server
initDb().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});

module.exports = app;