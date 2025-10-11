// Debug script to test order creation and product addition
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function debugOrderCreation() {
  console.log("🔍 Debugging Order Creation Process...\n");
  
  try {
    // Step 1: Create an order
    console.log("1️⃣ Creating order...");
    const orderData = {
      name: "John",
      lastname: "Doe",
      email: "debug.test@example.com",
      phone: "+1-555-123-4567",
      company: "Test Company Inc",
      adress: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      country: "United States",
      postalCode: "10001",
      total: 99.99,
      status: "pending",
      orderNotice: "Debug test order"
    };

    const orderResponse = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
    console.log("✅ Order created successfully");
    console.log(`   Order ID: ${orderResponse.data.id}`);
    console.log(`   Full response:`, JSON.stringify(orderResponse.data, null, 2));

    const orderId = orderResponse.data.id;

    // Step 2: Add a product to the order
    console.log("\n2️⃣ Adding product to order...");
    const productData = {
      customerOrderId: orderId,
      productId: "10", // Use a valid product ID from your database
      quantity: 3
    };

    console.log(`   Sending product data:`, JSON.stringify(productData, null, 2));

    const productResponse = await axios.post(`${API_BASE_URL}/api/order-product`, productData);
    console.log("✅ Product added successfully");
    console.log(`   Product order ID: ${productResponse.data.id}`);
    console.log(`   Full response:`, JSON.stringify(productResponse.data, null, 2));

  } catch (error) {
    console.log("❌ Error occurred:");
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

debugOrderCreation();
