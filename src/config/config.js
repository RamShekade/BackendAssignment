require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  shipmentApiUrl: process.env.SHIPMENT_API_URL || 'https://api.example.com/createShipment',
  shipmentApiKey: process.env.SHIPMENT_API_KEY || '',
  retryCount: process.env.RETRY_COUNT || 3,
  initialRetryDelay: process.env.INITIAL_RETRY_DELAY || 3000, // in milliseconds
};