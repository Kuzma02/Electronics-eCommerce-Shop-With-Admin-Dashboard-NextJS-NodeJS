const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



async function createOrder(request, response) {
  const body = await request.json();

  const order = await prisma.order.findUnique({
    where: { email: body.email },
  });

  if (order) {
    return response.status(400).json({ error: "Order already exists" });
  }

  const newOrder = await prisma.order.create({
    data: {
      name: body.name,
      lastname: body.lastname,
      phone: body.phone,
      email: body.email,
      company: body.company,
      adress: body.adress,
      apartment: body.apartment,
      city: body.city,
      country: body.country,
      postalCode: body.postalCode,
    },
  });

  return response.status(201).json({ newOrder });
}

module.exports = {
  createOrder,
};
