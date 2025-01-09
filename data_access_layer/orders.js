const { Order, OrderItem } = require("../models");

const getAllOrders = async function () {
    return await Order.collection().fetch({
        withRelated: ["orderItems"] // Fetch related order items for each order
    });
}

const getOrderById = async function (orderId) {
    return await Order.where({
        'order_id': orderId
    }).fetch({
        withRelated: ["orderItems"], // Fetch related order items
        require: false // Allow null if no order is found
    });
}

const createOrder = async (orderData) => {
    console.log("this is inside create order", orderData);

    const order = new Order({
        order_date: orderData.order_date,
        total_cost: orderData.total_cost,
        delivery_date: orderData.delivery_date,
        delivery_time: orderData.delivery_time,
        delivery_address: orderData.delivery_address
    });

    const savedOrder = await order.save();
    console.log("The ORDER was saved:", savedOrder);

    for (let item of orderData.orderItemsData) {
        const orderItem = new OrderItem({
            order_id: savedOrder.get("order_id"),
            product_name: item.product_name,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
            subtotal: item.subtotal
        });
        await orderItem.save();
    }

    return savedOrder;
}

const updateOrder = async function (orderId, orderData) {
    try {
        // Fetch the order by ID
        const order = await getOrderById(orderId);
        if (!order) {
            return false; // Return false if the order does not exist
        }

        // Update the order details
        const { orderItemsData, ...orderFields } = orderData; // Separate order items from order fields
        order.set(orderFields); // Use spread operator to update the order fields
        await order.save();

        // Delete all existing order items for the order
        await OrderItem.where({ order_id: orderId }).destroy({ require: false });

        // Insert the new order items
        for (let item of orderItemsData) {
            const newOrderItem = new OrderItem({
                order_id: orderId,
                ...item // Spread the item data directly
            });
            await newOrderItem.save();
        }

        return true;
    } catch (error) {
        console.error("Error in updateOrder:", error);
        throw error;
    }
};




const deleteOrder = async function (orderId) {
    const order = await getOrderById(orderId);
    if (order) {
        await order.related('orderItems').invokeThen('destroy'); // Delete related order items
        await order.destroy();
        return true;
    }
    return false;
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
