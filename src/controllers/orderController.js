const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    // Validating request body
    if (!req.body || !req.body.order_id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Order ID is required.'
      });
    }
    
    // processing the order data and creating shipment
    const result = await orderService.processOrder(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in createOrder controller:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process order',
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
};