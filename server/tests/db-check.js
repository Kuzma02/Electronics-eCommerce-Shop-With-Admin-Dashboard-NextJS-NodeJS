const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const prisma = require('../utills/db');

(async () => {
  try {
    const cat = await prisma.category.create({ data: { name: 'db-check-' + Math.random().toString(36).slice(2,8) } });
    console.log('Created category:', cat.id);
    const prod = await prisma.product.create({
      data: {
        title: 'DB Check Product',
        slug: 'db-check-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6),
        price: 111,
        rating: 5,
        description: 'test',
        manufacturer: 'test',
        mainImage: 'x.webp',
        categoryId: cat.id,
        inStock: 1,
      }
    });
    console.log('Created product:', prod.id);
    await prisma.product.delete({ where: { id: prod.id } });
    await prisma.category.delete({ where: { id: cat.id } });
    console.log('Cleanup OK');
  } catch (e) {
    console.error('DB check failed:', e.message);
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
