const axios = require('axios');
const config = require('../config/config');
const { withRetry } = require('../utils/retryMechanism');

// This Function Transforms the order data to match the third-party API's expected format
 
const transformOrderToShipmentPayload = (orderData) => {
  return {
    channelId: "EXPRESS_API",
    returnShipmentFlag: "false",
    Shipment: {
      code: orderData.order_id,
      orderCode: orderData.order_id,
      weight: orderData.dimensions.weight.toString(),
      length: orderData.dimensions.length.toString(),
      height: orderData.dimensions.height.toString(),
      breadth: orderData.dimensions.breadth.toString(),
      items: {
        name: orderData.order_items[0].sku_name,
        description: orderData.order_items[0].sku_name,
        quantity: orderData.order_items[0].quantity.toString(),
        item_value: orderData.order_items[0].sku_mrp.toString(),
        skuCode: orderData.order_items[0].sku
      },
    },
    deliveryAddressDetails: {
      name: orderData.customer_name,
      email: orderData.customer_email,
      phone: orderData.customer_phone,
      address1: orderData.customer_address_line1,
      address2: orderData.customer_address_line2,
      pincode: orderData.customer_pincode,
      city: orderData.customer_city,
      state: orderData.customer_state,
      country: orderData.customer_country
    },
    pickupAddressDetails: {
      name: orderData.pickup_location,
    },
    currencyCode: "INR",
    paymentMode: orderData.order_type === "PREPAID" ? "PREPAID" : "COD",
    totalAmount: orderData.invoice_value,
    collectableAmount: orderData.cod_amount
  };
};


const createShipment = async (orderData) => {
  const shipmentPayload = transformOrderToShipmentPayload(orderData);
  let attemptCount = 0;
  const maxRetries = config.retryCount || 3;

  const makeApiCall = async () => {
    attemptCount++;
    console.log(`Attempt ${attemptCount}: Calling Shipment API...`);

    try {
      // actual API call
      // const response = await axios.post(
      //   config.shipmentApiUrl,
      //   shipmentPayload,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${config.shipmentApiKey}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      
      //Simulated API call for testing retry mechanism
      await new Promise((resolve) => setTimeout(resolve, 1000));

 
      if (attemptCount < maxRetries) {
        throw new Error("Simulated API timeout or 500 server error");
      }

      // If it’s the last attempt → return predefined success
      const apiResponse = {
        status: 'SUCCESS',
        message: 'Shipment created successfully (Simulated Final Success)',
        data: {
          waybill: 'BLZ' + Math.floor(Math.random() * 1000000),
          orderCode: shipmentPayload.Shipment.orderCode,
          pickupAddress: shipmentPayload.pickupAddressDetails.name,
          deliveryAddress: shipmentPayload.deliveryAddressDetails.city,
          shipmentStatus: 'CREATED'
        }
      };

      console.log("✅ API Response:", apiResponse);
      return apiResponse;
    } catch (error) {
      console.error(`❌ API Call Failed (Attempt ${attemptCount}):`, error.message);
      throw error;
    }
  };

  // Retry decision logic
  const shouldRetryApiCall = (error) => {
    return (
      !error.response ||
      error.message.toLowerCase().includes("timeout") ||
      error.message.toLowerCase().includes("server")
    );
  };

  try {
    const result = await withRetry(
      makeApiCall,
      maxRetries,
      config.initialRetryDelay || 1000,
      shouldRetryApiCall
    );

    console.log("📦 Shipment successfully created after retries:", result.data.waybill);
    return result;
  } catch (finalError) {
    console.error("Shipment creation failed after all retries:", finalError.message);
    throw new Error("Shipment creation failed after multiple retries.");
  }
};

module.exports = {
  createShipment,
  transformOrderToShipmentPayload,
};
