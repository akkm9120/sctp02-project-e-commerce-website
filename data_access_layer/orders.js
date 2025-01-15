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
    try {
        console.log("this is inside create order", orderData);

        const order = new Order({
            order_date: orderData.order_date,
            total_cost: orderData.total_cost,
            delivery_date: orderData.delivery_date,
            delivery_time: orderData.delivery_time,
            delivery_address: orderData.delivery_address
        });

        // Saving the order and checking for errors
        const savedOrder = await order.save();
        console.log("The ORDER was saved:", savedOrder);

        // Saving order items and checking for errors
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

    } catch (error) {
        console.error("Error creating the order:", error);
        throw new Error("Failed to create the order. Please try again later.");
    }
};
const updateOrder = async function (orderId, orderData) {
    try {
      const order = await getOrderById(orderId);
      if (!order) {
        return false;
      }
  
      // Format the dates correctly for MySQL
      const formattedOrderDate = new Date(orderData.order_date).toISOString().slice(0, 19).replace('T', ' ');
      const formattedDeliveryDate = new Date(orderData.delivery_date).toISOString().slice(0, 10);
  
      // Update the order details with formatted dates
      await order.set({
        order_date: formattedOrderDate,
        total_cost: orderData.total_cost,
        delivery_date: formattedDeliveryDate,
        delivery_time: orderData.delivery_time,
        delivery_address: orderData.delivery_address,
      }).save();
  
      // Delete all existing order items
    //   await OrderItem.where({ order_id: orderId }).destroy({ require: false });
  
    //   // Insert the new order items using orderItems instead of orderItemsData
    //   for (let item of orderData.orderItems) {
    //     const newOrderItem = new OrderItem({
    //       order_id: orderId,
    //       product_name: item.product_name,
    //       quantity: item.quantity,
    //       price_per_unit: item.price_per_unit,
    //       subtotal: item.subtotal
    //     });
    //     await newOrderItem.save();
    //   }
  
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
