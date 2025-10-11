const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validateOrderData, ValidationError } = require('../utills/validation');
const { createOrderUpdateNotification } = require('../utills/notificationHelpers');

async function createCustomerOrder(request, response) {
  try {
    console.log("=== ORDER CREATION REQUEST ===");
    console.log("Request body:", JSON.stringify(request.body, null, 2));
    
    // Validate request body
    if (!request.body || typeof request.body !== 'object') {
      console.log("❌ Invalid request body");
      return response.status(400).json({ 
        error: "Invalid request body",
        details: "Request body must be a valid JSON object"
      });
    }

    // Server-side validation
    const validation = validateOrderData(request.body);
    console.log("Validation result:", validation);
    
    if (!validation.isValid) {
      console.log("❌ Validation failed:", validation.errors);
      return response.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    const validatedData = validation.validatedData;
    console.log("✅ Validation passed, validated data:", validatedData);

    // Additional business logic validation
    if (validatedData.total < 0.01) {
      console.log("❌ Invalid total amount");
      return response.status(400).json({
        error: "Invalid order total",
        details: [{ field: 'total', message: 'Order total must be at least $0.01' }]
      });
    }

    // Check for duplicate orders (same email and total within last 1 minute) - less strict
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const duplicateOrder = await prisma.customer_order.findFirst({
      where: {
        email: validatedData.email,
        total: validatedData.total,
        dateTime: {
          gte: oneMinuteAgo
        }
      }
    });

    if (duplicateOrder) {
      console.log("❌ Duplicate order detected (same email, amount, within 1 minute)");
      return response.status(409).json({
        error: "Duplicate order detected",
        details: "An identical order was just created. Please wait a moment before creating another order with the same details."
      });
    }

    console.log("Creating order in database...");
    // Create the order with validated data
    const corder = await prisma.customer_order.create({
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        company: validatedData.company,
        adress: validatedData.adress,
        apartment: validatedData.apartment,
        postalCode: validatedData.postalCode,
        status: validatedData.status,
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice,
        total: validatedData.total,
        dateTime: new Date()
      },
    });

    console.log("✅ Order created successfully:", corder);
    console.log("Order ID:", corder.id);

    // Create notification for the user if they have an account
    try {
      let user = null;
      
      // First, try to use userId if provided (from logged-in user)
      if (request.body.userId) {
        console.log(`🔍 Using provided userId: ${request.body.userId}`);
        user = await prisma.user.findUnique({
          where: { id: request.body.userId }
        });
        if (user) {
          console.log(`✅ Found user by ID: ${user.email}`);
        } else {
          console.log(`❌ User not found with ID: ${request.body.userId}`);
        }
      }
      
      // Fallback: search by email if no userId or user not found
      if (!user) {
        console.log(`🔍 Searching user by email: ${validatedData.email}`);
        user = await prisma.user.findUnique({
          where: { email: validatedData.email }
        });
        if (user) {
          console.log(`✅ Found user by email: ${user.email}`);
        }
      }
      
      if (user) {
        await createOrderUpdateNotification(
          user.id,
          'confirmed',
          corder.id,
          validatedData.total
        );
        console.log(`📧 Order confirmation notification sent to user: ${user.email}`);
      } else {
        console.log(`ℹ️  No user account found for email: ${validatedData.email} - notification skipped`);
      }
    } catch (notificationError) {
      console.error('❌ Failed to create order notification:', notificationError);
      // Don't fail the order if notification fails
    }

    // Log successful order creation (for monitoring)
    console.log(`Order created successfully: ID ${corder.id}, Email: ${validatedData.email}, Total: $${validatedData.total}`);

    const responseData = {
      id: corder.id,
      message: "Order created successfully",
      orderNumber: corder.id
    };
    
    console.log("Sending response:", responseData);
    return response.status(201).json(responseData);

  } catch (error) {
    console.error("❌ Error creating order:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return response.status(409).json({ 
        error: "Order conflict",
        details: "An order with this information already exists"
      });
    }

    // Handle validation errors
    if (error instanceof ValidationError) {
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: error.field, message: error.message }]
      });
    }

    // Generic error response
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to create order. Please try again later."
    });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    // Validate ID format
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    // Validate request body
    if (!request.body || typeof request.body !== 'object') {
      return response.status(400).json({ 
        error: "Invalid request body",
        details: "Request body must be a valid JSON object"
      });
    }

    // Server-side validation for update data
    const validation = validateOrderData(request.body);
    
    if (!validation.isValid) {
      return response.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    const validatedData = validation.validatedData;

    const existingOrder = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrder) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        company: validatedData.company,
        adress: validatedData.adress,
        apartment: validatedData.apartment,
        postalCode: validatedData.postalCode,
        status: validatedData.status,
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice,
        total: validatedData.total,
      },
    });

    // Create notification for status update if status changed
    if (existingOrder.status !== validatedData.status) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: validatedData.email }
        });
        
        if (user) {
          await createOrderUpdateNotification(
            user.id,
            validatedData.status,
            updatedOrder.id,
            validatedData.total
          );
          console.log(`📧 Status update notification sent to user: ${user.email} - Status: ${validatedData.status}`);
        }
      } catch (notificationError) {
        console.error('❌ Failed to create status update notification:', notificationError);
      }
    }

    console.log(`Order updated successfully: ID ${updatedOrder.id}`);

    return response.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    
    if (error.code === 'P2025') {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({
        error: "Validation failed",
        details: [{ field: error.field, message: error.message }]
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to update order. Please try again later."
    });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    const existingOrder = await prisma.customer_order.findUnique({
      where: { id: id },
    });

    if (!existingOrder) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    await prisma.customer_order.delete({
      where: {
        id: id,
      },
    });

    console.log(`Order deleted successfully: ID ${id}`);
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    
    if (error.code === 'P2025') {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }

    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to delete order. Please try again later."
    });
  }
}

async function getCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    
    if (!id || typeof id !== 'string') {
      return response.status(400).json({
        error: "Invalid order ID",
        details: "Order ID must be provided"
      });
    }

    const order = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });
    
    if (!order) {
      return response.status(404).json({ 
        error: "Order not found",
        details: "The specified order does not exist"
      });
    }
    
    return response.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch order. Please try again later."
    });
  }
}

async function getAllOrders(request, response) {
  try {
    // Add pagination and filtering for better performance
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return response.status(400).json({
        error: "Invalid pagination parameters",
        details: "Page must be >= 1, limit must be between 1 and 100"
      });
    }

    const [orders, totalCount] = await Promise.all([
      prisma.customer_order.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          dateTime: 'desc'
        }
      }),
      prisma.customer_order.count()
    ]);

    return response.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response.status(500).json({ 
      error: "Internal server error",
      details: "Failed to fetch orders. Please try again later."
    });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
};