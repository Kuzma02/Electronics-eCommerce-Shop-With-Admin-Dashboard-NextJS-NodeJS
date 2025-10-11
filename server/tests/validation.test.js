// Test file for server-side validation
const { validateOrderData, validatePaymentData, ValidationError } = require('../utills/validation');

// Test helper function
function runTest(testName, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${testName} - PASSED`);
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}`);
  }
}

// Test valid order data
function testValidOrderData() {
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
    orderNotice: "Please deliver after 5 PM"
  };

  const result = validateOrderData(validOrderData);
  
  if (!result.isValid) {
    throw new Error(`Expected valid order, but got errors: ${JSON.stringify(result.errors)}`);
  }
  
  if (result.validatedData.name !== "John") {
    throw new Error("Name validation failed");
  }
}

// Test invalid email
function testInvalidEmail() {
  const invalidOrderData = {
    name: "John",
    lastname: "Doe",
    email: "invalid-email",
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

  const result = validateOrderData(invalidOrderData);
  
  if (result.isValid) {
    throw new Error("Expected invalid order due to email, but validation passed");
  }
  
  const emailError = result.errors.find(error => error.field === 'email');
  if (!emailError) {
    throw new Error("Expected email validation error");
  }
}

// Test missing required fields - UPDATED
function testMissingRequiredFields() {
  const incompleteOrderData = {
    name: "John",
    // Intentionally missing: lastname, email, phone, company, adress, apartment, city, country, postalCode
    total: 99.99
  };

  const result = validateOrderData(incompleteOrderData);
  
  if (result.isValid) {
    throw new Error("Expected invalid order due to missing fields, but validation passed");
  }
  
  // Check for specific missing field errors
  const requiredFields = ['lastname', 'email', 'phone', 'company', 'adress', 'apartment', 'city', 'country', 'postalCode'];
  const missingFieldErrors = result.errors.filter(error => requiredFields.includes(error.field));
  
  console.log(`   Found ${result.errors.length} total errors:`, result.errors.map(e => e.field));
  
  if (missingFieldErrors.length < 5) {
    throw new Error(`Expected at least 5 missing field validation errors, got ${missingFieldErrors.length}. All errors: ${JSON.stringify(result.errors)}`);
  }
}

// Test invalid total amount
function testInvalidTotal() {
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

  const result = validateOrderData(invalidTotalOrderData);
  
  if (result.isValid) {
    throw new Error("Expected invalid order due to negative total, but validation passed");
  }
  
  const totalError = result.errors.find(error => error.field === 'total');
  if (!totalError) {
    throw new Error("Expected total validation error");
  }
}

// Test XSS protection
function testXSSProtection() {
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

  const result = validateOrderData(xssOrderData);
  
  if (result.isValid) {
    throw new Error("Expected invalid order due to XSS in email, but validation passed");
  }
  
  const emailError = result.errors.find(error => error.field === 'email');
  if (!emailError || !emailError.message.includes('invalid characters')) {
    throw new Error(`Expected XSS protection error, got: ${emailError ? emailError.message : 'no email error'}`);
  }
}

// Test payment validation
function testPaymentValidation() {
  const validPaymentData = {
    cardNumber: "4532015112830366", // Valid Visa card
    cvv: "123",
    expDate: "12/25",
    cardholderName: "John Doe"
  };

  const result = validatePaymentData(validPaymentData);
  
  if (!result.isValid) {
    throw new Error(`Expected valid payment, but got errors: ${JSON.stringify(result.errors)}`);
  }
}

// Test invalid credit card
function testInvalidCreditCard() {
  const invalidPaymentData = {
    cardNumber: "1234567890123456", // Invalid card number
    cvv: "123",
    expDate: "12/25",
    cardholderName: "John Doe"
  };

  const result = validatePaymentData(invalidPaymentData);
  
  if (result.isValid) {
    throw new Error("Expected invalid payment due to invalid card number, but validation passed");
  }
  
  const cardError = result.errors.find(error => error.field === 'cardNumber');
  if (!cardError) {
    throw new Error("Expected card number validation error");
  }
}

// Run all tests
console.log(" Running Server-Side Validation Tests...\n");

runTest("Valid Order Data", testValidOrderData);
runTest("Invalid Email", testInvalidEmail);
runTest("Missing Required Fields", testMissingRequiredFields);
runTest("Invalid Total Amount", testInvalidTotal);
runTest("XSS Protection", testXSSProtection);
runTest("Valid Payment Data", testPaymentValidation);
runTest("Invalid Credit Card", testInvalidCreditCard);

console.log("\n✅ Validation tests completed!");
