const express = require('express');
const router = express.Router();
const orderDataLayer = require('../../data_access_layer/orders');

router.get('/', async (req, res) => {
    try {
        const orders = await orderDataLayer.getAllOrders();
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch orders"
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const orderData = { ...req.body };
        console.log("Processing new order:", orderData);

        const newOrder = await orderDataLayer.createOrder(orderData);
        console.log("Response from adding new order:", newOrder);

        res.status(201).json({
            success: true,
            order: newOrder,
            message: "Order created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to create order"
        });
    }
});


router.put('/update/:order_id', async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const orderData = { ...req.body };

        console.log("Payload received for order update:", orderData);

        const isUpdated = await orderDataLayer.updateOrder(orderId, orderData);

        if (isUpdated) {
            res.json({
                success: true,
                message: "Order updated successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update order"
        });
    }
});

router.delete('/delete/:order_id', async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const isDeleted = await orderDataLayer.deleteOrder(orderId);

        if (isDeleted) {
            res.json({
                success: true,
                message: "Order deleted successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to delete order"
        });
    }
});

module.exports = router;
