const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const demoMerchant = [
  {
    id: "1",
    name: "Demo Merchant",
    description: "This is demo merchant description",
    phone: "1234567890",
    address: "123 Demo St, Demo City, DM 12345",
    status: "active",
    createdAt : new Date(),
    updatedAt : new Date(),
  }
]

const demoProducts = [
  {
    id: "1",
    title: "Smart phone",
    price: 22,
    rating: 5,
    description: "This is smart phone description",
    mainImage: "product1.webp",
    slug: "smart-phone-demo",
    manufacturer: "Samsung",
    categoryId: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e",
    inStock: 0,
    merchantId: "1",
  },
  {
    id: "2",
    title: "SLR camera",
    price: 24,
    rating: 0,
    description: "This is slr description",
    mainImage: "product2.webp",
    slug: "slr-camera-demo",
    manufacturer: "Canon",
    categoryId: "659a91b9-3ff6-47d5-9830-5e7ac905b961",
    inStock: 0,
    merchantId: "1",
  },
  {
    id: "3",
    title: "Mixer grinder",
    price: 25,
    rating: 4,
    description: "This is mixed grinder description",
    mainImage: "product3.webp",
    slug: "mixed-grinder-demo",
    manufacturer: "ZunVolt",
    categoryId: "6c3b8591-b01e-4842-bce1-2f5585bf3a28",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "4",
    title: "Phone gimbal",
    price: 21,
    rating: 5,
    description: "This is phone gimbal description",
    mainImage: "product4.webp",
    slug: "phone-gimbal-demo",
    manufacturer: "Samsung",
    categoryId: "d30b85e2-e544-4f48-8434-33fe0b591579",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "5",
    title: "Tablet keyboard",
    price: 52,
    rating: 4,
    description: "This is tablet keyboard description",
    mainImage: "product5.webp",
    slug: "tablet-keyboard-demo",
    manufacturer: "Samsung",
    categoryId: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "6",
    title: "Wireless earbuds",
    price: 74,
    rating: 3,
    description: "This is earbuds description",
    mainImage: "product6.webp",
    slug: "wireless-earbuds-demo",
    manufacturer: "Samsung",
    categoryId: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "7",
    title: "Party speakers",
    price: 35,
    rating: 5,
    description: "This is party speakers description",
    mainImage: "product7.webp",
    slug: "party-speakers-demo",
    manufacturer: "SOWO",
    categoryId: "7a241318-624f-48f7-9921-1818f6c20d85",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "8",
    title: "Slow juicer",
    price: 69,
    rating: 5,
    description: "Slow juicer desc",
    mainImage: "product8.webp",
    slug: "slow-juicer-demo",
    manufacturer: "Bosch",
    categoryId: "8d2a091c-4b90-4d60-b191-114b895f3e54",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "9",
    title: "Wireless headphones",
    price: 89,
    rating: 3,
    description: "This is wireless headphones description",
    mainImage: "product9.webp",
    slug: "wireless-headphones-demo",
    manufacturer: "Sony",
    categoryId: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "10",
    title: "Smart watch",
    price: 64,
    rating: 3,
    description: "This is smart watch description",
    mainImage: "product10.webp",
    slug: "smart-watch-demo",
    manufacturer: "Samsung",
    categoryId: "a6896b67-197c-4b2a-b5e2-93954474d8b4",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "11",
    title: "Notebook horizon",
    price: 52,
    rating: 5,
    description: "This is notebook description",
    mainImage: "product11.webp",
    slug: "notebook-horizon-demo",
    manufacturer: "HP",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "12",
    title: "Mens trimmer",
    price: 54,
    rating: 5,
    description: "This is trimmer description",
    mainImage: "product12.webp",
    slug: "mens-trimmer-demo",
    manufacturer: "Gillete",
    categoryId: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb",
    inStock: 0,
    merchantId: "1",
  }
];


const demoCategories = [
  {
    id: "7a241318-624f-48f7-9921-1818f6c20d85",
    name: "speakers",
  },
  {
    id: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb",
    name: "trimmers",
  },
  {
    id: "782e7829-806b-489f-8c3a-2689548d7153",
    name: "laptops",
  },
  {
    id: "a6896b67-197c-4b2a-b5e2-93954474d8b4",
    name: "watches",
  },
  {
    id: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423",
    name: "headphones",
  },
  {
    id: "8d2a091c-4b90-4d60-b191-114b895f3e54",
    name: "juicers",
  },
  {
    id: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b",
    name: "earbuds",
  },
  {
    id: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24",
    name: "tablets",
  },
  {
    id: "d30b85e2-e544-4f48-8434-33fe0b591579",
    name: "phone-gimbals",
  },
  {
    id: "6c3b8591-b01e-4842-bce1-2f5585bf3a28",
    name: "mixer-grinders",
  },
  {
    id: "659a91b9-3ff6-47d5-9830-5e7ac905b961",
    name: "cameras",
  },
  {
    id: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e",
    name: "smart-phones",
  },
  {
    id: "da6413b4-22fd-4fbb-9741-d77580dfdcd5",
    name: "mouses"
  },
  {
    id: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2",
    name: "computers"
  },
  {
    id: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3",
    name: "printers"
  }
];

async function insertDemoData() {

  for (const merchant of demoMerchant) {
    await prisma.merchant.create({
      data: merchant,
    });
  }
  console.log("Demo merchant inserted successfully!");

  for (const category of demoCategories) {
    await prisma.category.create({
      data: category,
    });
  }
  console.log("Demo categories inserted successfully!");

  for (const product of demoProducts) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log("Demo products inserted successfully!");
}

insertDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });