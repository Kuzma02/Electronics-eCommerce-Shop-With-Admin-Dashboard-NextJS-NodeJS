// API endpoint testing
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Test helper function
async function testAPI(testName, testFunction) {
  try {
    await testFunction();
    console.log(`✅ ${testName} - PASSED`);
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}`);
  }
}

// Test valid order creation
async function testValidOrderCreation() {
  const validOrderData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: 99.99,
    status: "pending",
    orderNotice: "Test order"
  };

  const response = await axios.post(`${API_BASE_URL}/api/orders`, validOrderData);
  
  if (response.status !== 201) {
    throw new Error(`Expected status 201, got ${response.status}`);
  }
  
  if (!response.data.id) {
    throw new Error("Expected order ID in response");
  }
  
  console.log(`   Created order with ID: ${response.data.id}`);
}

// Test invalid order creation
async function testInvalidOrderCreation() {
  const invalidOrderData = {
    name: "John",
    lastname: "Doe",
    email: "invalid-email", // Invalid email
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: 99.99,
    status: "pending"
  };

  try {
    await axios.post(`${API_BASE_URL}/api/orders`, invalidOrderData);
    throw new Error("Expected validation error, but request succeeded");
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error(`Expected status 400, got ${error.response?.status}`);
    }
    
    const errorData = error.response.data;
    if (errorData.error !== "Validation failed") {
      throw new Error(`Expected validation error, got: ${errorData.error}`);
    }
    
    const emailError = errorData.details.find(detail => detail.field === 'email');
    if (!emailError) {
      throw new Error("Expected email validation error in response");
    }
  }
}

// Test missing required fields
async function testMissingRequiredFields() {
  const incompleteOrderData = {
    name: "John",
    // Missing required fields
    total: 99.99
  };

  try {
    await axios.post(`${API_BASE_URL}/api/orders`, incompleteOrderData);
    throw new Error("Expected validation error, but request succeeded");
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error(`Expected status 400, got ${error.response?.status}`);
    }
    
    const errorData = error.response.data;
    if (errorData.details.length < 5) {
      throw new Error(`Expected at least 5 validation errors, got ${errorData.details.length}`);
    }
  }
}

// Test invalid total amount
async function testInvalidTotal() {
  const invalidTotalOrderData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: -10, // Invalid negative total
    status: "pending"
  };

  try {
    await axios.post(`${API_BASE_URL}/api/orders`, invalidTotalOrderData);
    throw new Error("Expected validation error, but request succeeded");
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error(`Expected status 400, got ${error.response?.status}`);
    }
    
    const errorData = error.response.data;
    const totalError = errorData.details.find(detail => detail.field === 'total');
    if (!totalError) {
      throw new Error("Expected total validation error");
    }
  }
}

// Test XSS protection
async function testXSSProtection() {
  const xssOrderData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com<script>alert('xss')</script>",
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: 99.99,
    status: "pending"
  };

  try {
    await axios.post(`${API_BASE_URL}/api/orders`, xssOrderData);
    throw new Error("Expected validation error, but request succeeded");
  } catch (error) {
    if (error.response?.status !== 400) {
      throw new Error(`Expected status 400, got ${error.response?.status}`);
    }
    
    const errorData = error.response.data;
    const emailError = errorData.details.find(detail => detail.field === 'email');
    if (!emailError || !emailError.message.includes('invalid characters')) {
      throw new Error("Expected XSS protection error");
    }
  }
}

// Test duplicate order detection
async function testDuplicateOrderDetection() {
  const orderData = {
    name: "John",
    lastname: "Doe",
    email: "duplicate.test@example.com",
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: 99.99,
    status: "pending"
  };

  // Create first order
  const response1 = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
  if (response1.status !== 201) {
    throw new Error("First order creation failed");
  }

  // Try to create duplicate order immediately
  try {
    await axios.post(`${API_BASE_URL}/api/orders`, orderData);
    throw new Error("Expected duplicate order error, but request succeeded");
  } catch (error) {
    if (error.response?.status !== 409) {
      throw new Error(`Expected status 409, got ${error.response?.status}`);
    }
    
    const errorData = error.response.data;
    if (!errorData.error.includes("Duplicate order detected")) {
      throw new Error("Expected duplicate order error message");
    }
  }
}

// Run all API tests
async function runAPITests() {
  console.log(" Running API Endpoint Tests...\n");
  
  await testAPI("Valid Order Creation", testValidOrderCreation);
  await testAPI("Invalid Order Creation", testInvalidOrderCreation);
  await testAPI("Missing Required Fields", testMissingRequiredFields);
  await testAPI("Invalid Total Amount", testInvalidTotal);
  await testAPI("XSS Protection", testXSSProtection);
  await testAPI("Duplicate Order Detection", testDuplicateOrderDetection);
  
  console.log("\n✅ API tests completed!");
}

// Export for use in other test files
module.exports = { runAPITests };
