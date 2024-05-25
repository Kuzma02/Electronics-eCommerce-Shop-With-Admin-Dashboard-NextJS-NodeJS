const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrderProduct(request, response) {
    try {
        const { customerOrderId, productId, quantity } = request.body;
        const corder = await prisma.customer_order_product.create({
            data: {
                customerOrderId,
                productId,
                quantity
            }
        });
        return response.status(201).json(corder);
    } catch (error) {
        console.error("Error creating prodcut order:", error);
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
            customerOrderId: id // Use customerOrderId for searching
        },
        include: {
            product: true // Including information about a product for response
        }
    });
    if (!order) {
        return response.status(404).json({ error: "Order not found" });
    }
    return response.status(200).json(order);
}


async function getAllProductOrders(request, response) {
    try {
        // Getting all orders from customer_order_product table
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

        // Creating map for storing data about orders grouped by customerOrderId
        const ordersMap = new Map();

        // Iterating through all orders
        for (const order of productOrders) {
            const { customerOrder, productId, quantity } = order;
            const { id, ...orderDetails } = customerOrder;

            // Finding a product from the table Product with productId
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
                // If there is input for customerOrderId, add a new product in existing map array
                ordersMap.get(id).products.push({ ...product, quantity });
            } else {
                // Otherwise create new input for customerOrderId and add the product
                ordersMap.set(id, {
                    customerOrderId: id,
                    customerOrder: orderDetails,
                    products: [{ ...product, quantity }]
                });
            }
        }

        // Converting map to object array
        const groupedOrders = Array.from(ordersMap.values());

        return response.json(groupedOrders);
    } catch (error) {
        console.error('Error fetching all product orders:', error);
        return response.status(500).json({ error: "Error fetching all product orders" });
    }
}



module.exports = { createOrderProduct, updateProductOrder, deleteProductOrder, getProductOrder,getAllProductOrders};