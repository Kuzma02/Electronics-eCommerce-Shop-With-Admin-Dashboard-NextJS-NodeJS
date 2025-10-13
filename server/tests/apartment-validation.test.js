// Test apartment validation with 1 character
const { validateOrderData } = require('../utills/validation');

function testApartmentValidation() {
  console.log("🧪 Testing Apartment Validation (1 character minimum)...\n");

  // Test with 1 character (should pass)
  const validOrderData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    company: "Test Company Inc",
    adress: "123 Main Street",
    apartment: "A", // 1 character - should pass
    city: "New York",
    country: "United States",
    postalCode: "10001",
    total: 99.99,
    status: "pending"
  };

  const result = validateOrderData(validOrderData);
  
  if (result.isValid) {
    console.log("✅ Apartment with 1 character - PASSED");
  } else {
    console.log("❌ Apartment with 1 character - FAILED");
    console.log("Errors:", result.errors);
  }

  // Test with empty string (should fail)
  const invalidOrderData = {
    ...validOrderData,
    apartment: "" // empty string - should fail
  };

  const result2 = validateOrderData(invalidOrderData);
  
  if (!result2.isValid) {
    const apartmentError = result2.errors.find(error => error.field === 'apartment');
    if (apartmentError && apartmentError.message.includes('required')) {
      console.log("✅ Empty apartment correctly rejected - PASSED");
    } else {
      console.log("❌ Empty apartment - FAILED");
      console.log("Errors:", result2.errors);
    }
  } else {
    console.log("❌ Empty apartment should have failed - FAILED");
  }

  // Test with 2 characters (should also pass)
  const validOrderData2 = {
    ...validOrderData,
    apartment: "A1" // 2 characters - should also pass
  };

  const result3 = validateOrderData(validOrderData2);
  
  if (result3.isValid) {
    console.log("✅ Apartment with 2 characters - PASSED");
  } else {
    console.log("❌ Apartment with 2 characters - FAILED");
    console.log("Errors:", result3.errors);
  }

  console.log("\n✅ Apartment validation test completed!");
}

testApartmentValidation();
