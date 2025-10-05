const shipmentService = require('./shipmentService');
const orderModel = require('../models/orderModel');

const processOrder = async (orderData) => {
  try {
    // Call third-party API to create shipment
    const shipmentResponse = await shipmentService.createShipment(orderData);
    
    // Saving response to the database
    const savedResponse = await orderModel.saveShipmentResponse(
      orderData.order_id,
      shipmentService.transformOrderToShipmentPayload(orderData),
      shipmentResponse
    );
    
    return {
      order_id: orderData.order_id,
      shipment_status: shipmentResponse.status,
      waybill: shipmentResponse.waybill,
      shipping_label: shipmentResponse.shippingLabel,
      courier_name: shipmentResponse.courierName,
      message: shipmentResponse.message
    };
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
};

module.exports = {
  processOrder,
};