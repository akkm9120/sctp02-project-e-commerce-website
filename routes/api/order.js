const express = require('express');
const router = express.Router();
const orderDataLayer = require('../../data_access_layer/orders');
const { Order } = require('../../models');




router.get('/', async (req, res) => {
    let orders = await orderDataLayer.getAllOrders();
    res.json({
        orders: orders
    })
});

router.post('/', async (req, res) => {
    try {
        const orderData = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
        console.log("Processing new order:", orderData);
        
        const newOrder = await orderDataLayer.createOrder(orderData);
        
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




router.delete('/delete/:order_id', async function (req, res) {
    try {
        const order = await Order.where({
            'order_id': req.params.order_id
        }).fetch({
            required: true
        });

        await order.destroy();
        res.json({
            message: "Order deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to delete order"
        });
    }
});



module.exports = router;
