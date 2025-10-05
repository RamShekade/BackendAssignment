const db = require('../config/database');

const createShipmentTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        waybill VARCHAR(255),
        shipping_label TEXT,
        courier_name VARCHAR(255),
        status VARCHAR(50),
        request_payload JSONB,
        response_payload JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Shipments table created or already exists');
  } catch (error) {
    console.error('Error creating shipments table:', error);
    throw error;
  }
};

const saveShipmentResponse = async (orderId, requestPayload, responsePayload) => {
  try {
    const { status, waybill, shippingLabel, courierName } = responsePayload;
    
    const result = await db.query(
      `INSERT INTO shipments 
      (order_id, status, waybill, shipping_label, courier_name, request_payload, response_payload)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (order_id) 
      DO UPDATE SET 
        status = $2, 
        waybill = $3, 
        shipping_label = $4, 
        courier_name = $5,
        response_payload = $7,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        orderId, 
        status, 
        waybill || null, 
        shippingLabel || null, 
        courierName || null, 
        JSON.stringify(requestPayload), 
        JSON.stringify(responsePayload)
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving shipment response:', error);
    throw error;
  }
};

module.exports = {
  createShipmentTable,
  saveShipmentResponse,
};