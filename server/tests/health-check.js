// Health check script
const axios = require('axios');

async function healthCheck() {
  console.log("🏥 Running Health Check...\n");
  
  try {
    // Check if server is running
    const response = await axios.get('http://localhost:3001/health');
    console.log("✅ Server is running");
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Rate Limiting: ${response.data.rateLimiting}`);
    
    // Check rate limit info
    const rateLimitResponse = await axios.get('http://localhost:3001/rate-limit-info');
    console.log("✅ Rate limiting is configured");
    console.log(`   Order operations: ${rateLimitResponse.data.orders}`);
    
    // Test basic order endpoint (should return 400 for empty body)
    try {
      await axios.post('http://localhost:3001/api/orders', {});
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("✅ Order validation is working (rejected empty body)");
      } else {
        console.log(`❌ Unexpected response: ${error.response?.status}`);
      }
    }
    
    console.log("\n🎉 Health check passed! Server is ready for testing.");
    
  } catch (error) {
    console.log("❌ Health check failed:");
    console.log(`   Error: ${error.message}`);
    console.log("\n Troubleshooting:");
    console.log("1. Make sure the server is running: node server/app.js");
    console.log("2. Check if port 3001 is available");
    console.log("3. Verify database connection");
  }
}

healthCheck();
