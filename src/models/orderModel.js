const db = require('../config/database');

const createShipmentTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        shipment_status VARCHAR(50),
        waybill VARCHAR(255),
        delivery_address TEXT,
        pickup_address TEXT,
        message TEXT,
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

const saveShipmentResponse = async (orderId, shipmentData) => {
  try {
    const {
      shipment_status,
      waybill,
      deliveryAddress,
      pickupAddress,
      message
    } = shipmentData;

    const result = await db.query(
      `INSERT INTO shipments 
        (order_id, shipment_status, waybill, delivery_address, pickup_address, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (order_id) 
      DO UPDATE SET 
        shipment_status = $2,
        waybill = $3,
        delivery_address = $4,
        pickup_address = $5,
        message = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        orderId,
        shipment_status,
        waybill,
        deliveryAddress,
        pickupAddress,
        message
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