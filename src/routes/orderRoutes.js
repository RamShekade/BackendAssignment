const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');


// Order routes
router.post('/createOrder', verifyToken, orderController.createOrder);


module.exports = router;