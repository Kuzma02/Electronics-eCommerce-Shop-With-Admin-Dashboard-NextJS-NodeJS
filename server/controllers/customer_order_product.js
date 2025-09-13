const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrderProduct(request, response) {
    try {
        const { customerOrderId, productId, quantity } = request.body;
        
        // Validate required fields
        if (!customerOrderId) {
            return response.status(400).json({ error: "Customer order ID is required" });
        }
        if (!productId) {
            return response.status(400).json({ error: "Product ID is required" });
        }
        if (!quantity || quantity <= 0) {
            return response.status(400).json({ error: "Valid quantity is required" });
        }

        // Verify that the customer order exists
        const existingOrder = await prisma.customer_order.findUnique({
            where: { id: customerOrderId }
        });

        if (!existingOrder) {
            return response.status(404).json({ error: "Customer order not found" });
        }

        // Verify that the product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return response.status(404).json({ error: "Product not found" });
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
    } catch (error) {
        console.error("Error creating product order:", error);
        return response.status(500).json({ error: "Error creating product order" });
    }
}

async function updateProductOrder(request, response) {
    try {
        const { id } = request.params;
        const { customerOrderId, productId, quantity } = request.body;

        const existingOrder = await prisma.customer_order_product.findUnique({
            where: {
                id: id
            }
        });

        if (!existingOrder) {
            return response.status(404).json({ error: "Order not found" });
        }

        const updatedOrder = await prisma.customer_order_product.update({
            where: {
                id: existingOrder.id
            },
            data: {
                customerOrderId,
                productId,
                quantity
            }
        });

        return response.json(updatedOrder);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error updating order" });
    }
}

async function deleteProductOrder(request, response) {
    try {
        const { id } = request.params;
        await prisma.customer_order_product.deleteMany({
            where: {
                customerOrderId: id
            }
        });
        return response.status(204).send();
    } catch (error) {
        return response.status(500).json({ error: "Error deleting product orders" });
    }
}

async function getProductOrder(request, response) {
    const { id } = request.params;
    const order = await prisma.customer_order_product.findMany({
        where: {
            customerOrderId: id
        },
        include: {
            product: true
        }
    });
    if (!order) {
        return response.status(404).json({ error: "Order not found" });
    }
    return response.status(200).json(order);
}

async function getAllProductOrders(request, response) {
    try {
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
    } catch (error) {
        console.error('Error fetching all product orders:', error);
        return response.status(500).json({ error: "Error fetching all product orders" });
    }
}

module.exports = { 
    createOrderProduct, 
    updateProductOrder, 
    deleteProductOrder, 
    getProductOrder,
    getAllProductOrders
};