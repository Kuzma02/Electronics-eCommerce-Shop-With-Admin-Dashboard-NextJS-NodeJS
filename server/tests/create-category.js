const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const prisma = require('../utills/db');

(async () => {
  try {
    const name = 'curl-test-' + Math.random().toString(36).slice(2,8);
    const cat = await prisma.category.create({ data: { name } });
    console.log(cat.id);
  } catch (e) {
    console.error('Failed to create category:', e.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
