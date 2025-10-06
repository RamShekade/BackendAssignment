const shipmentService = require('./shipmentService');
const orderModel = require('../models/orderModel');

const processOrder = async (orderData) => {
  try {
    // Call third-party API to create shipment
    const shipmentResponse = await shipmentService.createShipment(orderData);
    
    // Saving response to the database
    const processedData = {
      order_id: orderData.order_id,
      shipment_status: shipmentResponse.status,
      waybill: shipmentResponse.data.waybill,
      deliveryAddress: shipmentResponse.data.deliveryAddress,
      pickupAddress: shipmentResponse.data.pickupAddress,
      message: shipmentResponse.message
    };

    const savedResponse = await orderModel.saveShipmentResponse(
      orderData.order_id,
      processedData
    );

    
    return {
      order_id: orderData.order_id,
      shipment_status: shipmentResponse.status,
      waybill: shipmentResponse.data.waybill,
      deliveryAddress: shipmentResponse.data.deliveryAddress,
      pickupAddress: shipmentResponse.data.pickupAddress,
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