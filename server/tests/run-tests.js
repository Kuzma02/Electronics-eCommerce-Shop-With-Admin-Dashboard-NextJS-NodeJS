// Main test runner
const { runAPITests } = require('./api.test');

async function runAllTests() {
  console.log(" Starting Comprehensive Testing Suite\n");
  console.log("=".repeat(50));
  
  // Run validation tests
  console.log("\n1️⃣ Running Validation Tests...");
  require('./validation.test.js');
  
  // Wait a moment between test suites
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run API tests
  console.log("\n2️⃣ Running API Tests...");
  await runAPITests();
  
  console.log("\n" + "=".repeat(50));
  console.log(" All tests completed!");
  console.log("\n📋 Next Steps:");
  console.log("1. Check server logs for any errors");
  console.log("2. Test the frontend checkout form");
  console.log("3. Verify error messages display correctly");
  console.log("4. Test with different browsers/devices");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };

```

```

