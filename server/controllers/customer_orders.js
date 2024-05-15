const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCustomerOrder(request, response) {
  try {
    console.log("Creating order:", request.body);
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
    } = request.body;
    const corder = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        status,
        city,
        country,
        orderNotice,
        total,
      },
    });
    console.log("Order created:", corder);
    return response.status(201).json(corder);
  } catch (error) {
    console.error("Error creating order:", error);
    return response.status(500).json({ error: "Error creating order" });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    console.log("Updating order with id:", id);
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
    } = request.body;

    const existingOrder = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrder) {
      return response.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        dateTime,
        status,
        city,
        country,
        orderNotice,
        total,
      },
    });

    return response.json(updatedOrder);
  } catch (error) {
    return response.status(500).json({ error: "Error updating order" });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    console.log("Deleting order with id:", id);
    await prisma.customer_order.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Error deleting order" });
  }
}

async function getCustomerOrder(request, response) {
  const { id } = request.params;
  const order = await prisma.customer_order.findUnique({
    where: {
      id: id,
    },
  });
  console.log(order);
  if (!order) {
    return response.status(404).json({ error: "Order not found" });
  }
  return response.status(200).json(order);
}

async function getAllOrders(request, response) {
  try {
    const orders = await prisma.customer_order.findMany({});
    return response.json(orders);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error fetching orders" });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
};
