const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Middleware to verify API token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Authorization header is missing.'
    });
  }
  
  const bearer = bearerHeader.split(' ');
  if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Invalid token format.'
    });
  }
  
  const token = bearer[1];
  

  if (!token || token !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Invalid token.'
    });
  }
  
  // Token is valid, proceed
  next();
};

// Order routes
router.post('/createOrder', verifyToken, orderController.createOrder);

module.exports = router;