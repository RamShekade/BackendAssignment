# Shipment API

A RESTful API built with Node.js, Express, and PostgreSQL for creating shipment orders. Includes integration with a third-party Create Shipment API, retry mechanism with exponential backoff, and stores shipment responses in the database.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [Notes](#notes)
- [Troubleshooting](#troubleshooting)

---

## Features

- Node.js + Express REST API
- PostgreSQL database integration
- Structured codebase (Routes, Controllers, Services, Models, Utils)
- Third-party shipment API integration (simulated or real)
- Retry mechanism with exponential backoff for API calls
- Stores shipment API responses in the database
- Basic authentication middleware

---

## Project Structure

```
src/
  app.js
  config/
    db.js
    config.js
  controllers/
    orderController.js
  models/
    orderModel.js
  routes/
    orderRoutes.js
  services/
    orderService.js
    shipmentService.js
  utils/
    retry.util.js
  middleware/
    auth.middleware.js
.env
package.json
README.md
```

---

## Environment Setup

1. **Clone the repository**  
   ```bash
   git clone <your-repo-url>
   cd shipment-api
   ```

2. **Create a `.env` file in the root directory:**

   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=shipment_db
   DB_USER=postgres
   DB_PASSWORD=postgres

   # API ENDPOINT KEY
   API_KEY="JkNfZ60jzNnqNDNi8Zbh8M6Op5xl8qsLc"

   # Shipment API
   SHIPMENT_API_URL=https://api.example.com/shipments
   SHIPMENT_API_KEY=your_api_key_here

   # Retry Configuration
   MAX_RETRIES=3
   RETRY_DELAY_BASE=1000
   ```

   > **Note**: Adjust the database credentials according to your PostgreSQL setup.

---

## Database Setup

1. **Create the database (required at setup):**
   ```bash
   psql -U postgres
   CREATE DATABASE shipment_db;
   ```
   > You MUST create the `shipment_db` database before running the server for the first time.

   > If you use a different user/password, update the `.env` accordingly.

2. **No manual table creation required!**  
   The tables will be auto-created on server start using Sequelize ORM or the provided scripts.

---

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Running the Application

- **Development mode (auto-restart):**
  ```bash
  npm run dev
  ```

- **Production mode:**
  ```bash
  npm start
  ```

If setup is correct, you should see:
```
Database synced successfully.
Server is running on port 3000.
```

---

## API Endpoints

### Create Order & Shipment

**POST** `/api/v1/order/createOrder`

- **Headers:**  
  `Authorization: Bearer <your_token_here>`  
  `Content-Type: application/json`

- **Body Example:**
  ```json
  {
    "order_id": "TESTORDER76",
    "order_created_time": "2025-09-10T03:04:25+05:30",
    "pickup_location": "Openleaf HQ",
    "customer_name": "Omkar",
    "customer_address_line1": "Room 3, Lane 123265",
    "customer_address_line2": "Delhi",
    "customer_pincode": "101084",
    "customer_city": "Delhi",
    "customer_state": "Delhi",
    "customer_country": "India",
    "customer_phone": "9400820477",
    "customer_email": "test@xyz.com",
    "order_items": [
      {
        "sku": "Nike-shoes-40",
        "sku_mrp": 2340,
        "quantity": 1,
        "sku_name": "Nike shoes",
        "brand_name": "",
        "product_image": ""
      }
    ],
    "invoice_value": "2340",
    "dimensions": {
      "height": 10,
      "length": 10,
      "weight": 300,
      "breadth": 10
    },
    "marketplace": "Shopify",
    "order_type": "PREPAID",
    "cod_amount": "0",
    "gst_total_tax": "0",
    "tax_percentage": "0",
    "invoice_number": "TESTORDER76",
    "order_note": "",
    "order_mode": "SURFACE"
  }
  ```

---

## API Response & Database Storage

When you successfully create an order and shipment, the API responds with (and stores in the database) the following structure:

```json
{
  "status": "SUCCESS",
  "message": "Shipment created successfully (Simulated Final Success)",
  "data": {
    "waybill": "BLZ942120",
    "orderCode": "111",
    "pickupAddress": "mywearhouse",
    "deliveryAddress": "Delhi",
    "shipmentStatus": "CREATED"
  }
}
```
> Only these fields are stored in the database for each shipment.

---

## Testing the API

### Example CURL

```bash
curl --request POST \
  --url http://localhost:3000/api/v1/order/createOrder \
  --header 'Authorization: Bearer JkNfZ60jzNnqNDNi8Zbh8M6Op5xl8qsLc' \
  --header 'Content-Type: application/json' \
  --data '{
    "order_id": "TESTORDER76",
    "order_created_time": "2025-09-10T03:04:25+05:30",
    "pickup_location": "Openleaf HQ",
    "customer_name": "Omkar",
    "customer_address_line1": "Room 3, Lane 123265",
    "customer_address_line2": "Delhi",
    "customer_pincode": "101084",
    "customer_city": "Delhi",
    "customer_state": "Delhi",
    "customer_country": "India",
    "customer_phone": "9400820477",
    "customer_email": "test@xyz.com",
    "order_items": [
      {
        "sku": "Nike-shoes-40",
        "sku_mrp": 2340,
        "quantity": 1,
        "sku_name": "Nike shoes",
        "brand_name": "",
        "product_image": ""
      }
    ],
    "invoice_value": "2340",
    "dimensions": {
      "height": 10,
      "length": 10,
      "weight": 300,
      "breadth": 10
    },
    "marketplace": "Shopify",
    "order_type": "PREPAID",
    "cod_amount": "0",
    "gst_total_tax": "0",
    "tax_percentage": "0",
    "invoice_number": "TESTORDER76",
    "order_note": "",
    "order_mode": "SURFACE"
  }'
```

---

## Notes

- **Authentication:** A simple Bearer token check is implemented. For production, use a robust authentication method.
- **Retries:** Configurable via `.env` (`MAX_RETRIES`, `RETRY_DELAY_BASE`).
- **Database:** Only the shipment API response fields (as shown above) are stored for each shipment.
- **Error Handling:** Errors and retry attempts are logged in the console.

---

## Troubleshooting

- **Cannot connect to PostgreSQL:**
  - Check your `.env` for correct credentials.
  - Ensure PostgreSQL service is running.
  - Use `psql -U postgres -d shipment_db` to connect manually.

- **Server fails to start:**
  - Check `.env` for missing values.
  - Check for missing dependencies: run `npm install`.

- **API not working:**
  - Ensure headers are set correctly (`Authorization`, `Content-Type`).
  - Use Postman or CURL to debug requests.

- **Tables not created:**
  - Check console output for Sequelize errors or migration errors.
  - Ensure your PostgreSQL user has privileges for database creation.

---

## Reminder

**You must create the `shipment_db` database at setup before running the server!**

---
