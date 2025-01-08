const { Order, OrderItem } = require("../models");

const getAllOrders = async function() {
    return await Order.collection().fetch({
        withRelated: ["orderItems"]
    });
}

const getOrderById = async function(orderId) {
    return await Order.where({
        'order_id': orderId
    }).fetch({
        withRelated: ["orderItems"],
        require: false
    });
}

const createOrder = async function(orderData) {
    orderData = JSON.parse(orderData);

    console.log("this is inside create order", orderData)
    const order = new Order({
        orderdate: orderData.orderdate,
        totalcost: orderData.totalcost
    });
    
    const savedOrder = await order.save();

    for (let item of orderData.orderItemsData) {
        const orderItem = new OrderItem({
            order_id: savedOrder.get("order_id"),
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
            subtotal: item.subtotal
        });
        await orderItem.save();
    }
    
    return savedOrder;
}

const updateOrder = async function(orderId, orderData) {
    const order = await getOrderById(orderId);
    if (order) {
        order.set('orderdate', orderData.orderdate);
        order.set('totalcost', orderData.totalcost);
        await order.save();
        return true;
    }
    return false;
}

const deleteOrder = async function(orderId) {
    const order = await getOrderById(orderId);
    if (order) {
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
