import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, create a category for electronic components if it doesn't exist
  const category = await prisma.category.upsert({
    where: { name: 'Electronic Components' },
    update: {},
    create: {
      name: 'Electronic Components',
    },
  });

  // Sample electronic components
  const products = [
    {
      title: 'Arduino Uno R3',
      description: 'Microcontroller board based on the ATmega328P',
      price: 2499, // $24.99
      inStock: 50,
      mainImage: '/images/products/arduino-uno.jpg',
      slug: 'arduino-uno-r3',
      manufacturer: 'Arduino',
      categoryId: category.id,
    },
    {
      title: 'Raspberry Pi 4 Model B (4GB)',
      description: 'Single-board computer with 4GB RAM',
      price: 4999, // $49.99
      inStock: 30,
      mainImage: '/images/products/raspberry-pi-4.jpg',
      slug: 'raspberry-pi-4-model-b-4gb',
      manufacturer: 'Raspberry Pi',
      categoryId: category.id,
    },
    {
      title: 'Breadboard 830 Points',
      description: 'Solderless prototype board with 830 tie points',
      price: 799, // $7.99
      inStock: 100,
      mainImage: '/images/products/breadboard.jpg',
      slug: 'breadboard-830-points',
      manufacturer: 'Generic',
      categoryId: category.id,
    },
    {
      title: 'LED Kit (100pcs)',
      description: 'Assorted color 5mm LEDs kit',
      price: 999, // $9.99
      inStock: 200,
      mainImage: '/images/products/led-kit.jpg',
      slug: 'led-kit-100pcs',
      manufacturer: 'Generic',
      categoryId: category.id,
    },
    {
      title: 'Resistor Kit (600pcs)',
      description: '1/4W resistors kit with various values',
      price: 1299, // $12.99
      inStock: 150,
      mainImage: '/images/products/resistor-kit.jpg',
      slug: 'resistor-kit-600pcs',
      manufacturer: 'Generic',
      categoryId: category.id,
    },
    {
      title: 'ESP32 Development Board',
      description: 'WiFi & Bluetooth enabled microcontroller board',
      price: 1999, // $19.99
      inStock: 75,
      mainImage: '/images/products/esp32.jpg',
      slug: 'esp32-development-board',
      manufacturer: 'Espressif',
      categoryId: category.id,
    },
    {
      title: 'Jumper Wires Kit (120pcs)',
      description: 'Male-to-male, male-to-female, and female-to-female jumper wires',
      price: 899, // $8.99
      inStock: 100,
      mainImage: '/images/products/jumper-wires.jpg',
      slug: 'jumper-wires-kit-120pcs',
      manufacturer: 'Generic',
      categoryId: category.id,
    },
    {
      title: 'Digital Multimeter',
      description: 'Auto-ranging digital multimeter with backlight',
      price: 2999, // $29.99
      inStock: 40,
      mainImage: '/images/products/multimeter.jpg',
      slug: 'digital-multimeter',
      manufacturer: 'Generic',
      categoryId: category.id,
    },
  ];

  // Create all products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log('Sample products have been added to the database');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 