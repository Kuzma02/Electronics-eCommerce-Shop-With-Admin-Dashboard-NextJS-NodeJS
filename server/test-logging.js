const http = require('http');

console.log('Testing logging system...\n');

// Test health endpoint
http.get('http://localhost:3001/health', (res) => {
  console.log('✓ Health check completed');
});

// Test products endpoint
http.get('http://localhost:3001/api/products', (res) => {
  console.log('✓ Products endpoint completed');
});

// Test 404 endpoint
http.get('http://localhost:3001/nonexistent', (res) => {
  console.log('✓ 404 test completed');
});

// Test suspicious request
http.get('http://localhost:3001/api/products?q=<script>alert("xss")</script>', (res) => {
  console.log('✓ Security test completed');
});

setTimeout(() => {
  console.log('\nTest completed. Check logs with: npm run logs');
}, 2000);
