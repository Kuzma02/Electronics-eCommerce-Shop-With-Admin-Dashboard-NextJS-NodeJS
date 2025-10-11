const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { asyncHandler, AppError } = require("../utills/errorHandler");

const createOrderProduct = asyncHandler(async (request, response) => {
  const { customerOrderId, productId, quantity } = request.body;
  
  // Validate required fields
  if (!customerOrderId) {
    throw new AppError("Customer order ID is required", 400);
  }
  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }
  if (!quantity || quantity <= 0) {
    throw new AppError("Valid quantity is required", 400);
  }

  // Verify that the customer order exists
  const existingOrder = await prisma.customer_order.findUnique({
    where: { id: customerOrderId }
  });

  if (!existingOrder) {
    throw new AppError("Customer order not found", 404);
  }

  // Verify that the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  // Create the order product
  const orderProduct = await prisma.customer_order_product.create({
    data: {
      customerOrderId: customerOrderId,
      productId: productId,
      quantity: parseInt(quantity)
    }
  });

  return response.status(201).json(orderProduct);
});

const updateProductOrder = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { customerOrderId, productId, quantity } = request.body;

  if (!id) {
    throw new AppError("Order product ID is required", 400);
  }

  const existingOrder = await prisma.customer_order_product.findUnique({
    where: {
      id: id
    }
  });

  if (!existingOrder) {
    throw new AppError("Order product not found", 404);
  }

  // Validate quantity if provided
  if (quantity !== undefined && quantity <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }

  const updatedOrder = await prisma.customer_order_product.update({
    where: {
      id: existingOrder.id
    },
    data: {
      customerOrderId: customerOrderId || existingOrder.customerOrderId,
      productId: productId || existingOrder.productId,
      quantity: quantity !== undefined ? quantity : existingOrder.quantity
    }
  });

  return response.json(updatedOrder);
});

const deleteProductOrder = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Order product ID is required", 400);
  }

  const existingOrder = await prisma.customer_order_product.findUnique({
    where: { id }
  });

  if (!existingOrder) {
    throw new AppError("Order product not found", 404);
  }

  await prisma.customer_order_product.deleteMany({
    where: {
      customerOrderId: id
    }
  });
  return response.status(204).send();
});

const getProductOrder = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Order ID is required", 400);
  }

  const order = await prisma.customer_order_product.findMany({
    where: {
      customerOrderId: id
    },
    include: {
      product: true
    }
  });
  
  if (!order || order.length === 0) {
    throw new AppError("Order not found", 404);
  }
  
  return response.status(200).json(order);
});

const getAllProductOrders = asyncHandler(async (request, response) => {
  const productOrders = await prisma.customer_order_product.findMany({
    select: {
      productId: true,
      quantity: true,
      customerOrder: {
        select: {
          id: true,
          name: true,
          lastname: true,
          phone: true,
          email: true,
          company: true,
          adress: true,
          apartment: true,
          postalCode: true,
          dateTime: true,
          status: true,
          total: true
        }
      }
    }
  });

  const ordersMap = new Map();

  for (const order of productOrders) {
    const { customerOrder, productId, quantity } = order;
    const { id, ...orderDetails } = customerOrder;

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        title: true,
        mainImage: true,
        price: true,
        slug: true
      }
    });

    if (ordersMap.has(id)) {
      ordersMap.get(id).products.push({ ...product, quantity });
    } else {
      ordersMap.set(id, {
        customerOrderId: id,
        customerOrder: orderDetails,
        products: [{ ...product, quantity }]
      });
    }
  }

  const groupedOrders = Array.from(ordersMap.values());

  return response.json(groupedOrders);
});

module.exports = { 
  createOrderProduct, 
  updateProductOrder, 
  deleteProductOrder, 
  getProductOrder,
  getAllProductOrders
};