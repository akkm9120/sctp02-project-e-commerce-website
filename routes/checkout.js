const express = require('express');
const router = express.Router();
const {checkIfAuthenticated} = require('../middlewares');

// cart service layer
const cart = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', [checkIfAuthenticated], async function(req,res){
    // 1. create the line items
    // each line item is each thing the user is going for pay
    const items = await cart.getCart(req.session.user.id);
    const lineItems = [];
    for (let i of items) {
        // when creating a line item, the keys that we can use
        // is defined by Stripe and we cannot use or our own keys
        const lineItem = {
            quantity: i.get('quantity'),
            // set the price
            price_data: {
                currency: 'SGD',
                unit_amount: i.related('product').get('cost'),
                product_data: {
                    name: i.related('product').get('name'),
                    metadata:{
                        product_id: i.get('product_id')
                    }
                }
            }
        }

        // if the product has an image, add it to the invoice as well
        if (i.related('product').get('image_url')) {
            lineItem.price_data.product_data.images = [ i.related('product').get('image_url')];
        }

        // push the finished line item into the array
        lineItems.push(lineItem);
    }
    // 2. create a payment session
    const payment = {
        payment_method_types:['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url:process.env.STRIPE_CANCEL_URL,
        metadata:{
            user_id: req.session.userId
        }
    }

    // 3. register the payment session with stripe and return its id
    const paymentSession = await Stripe.checkout.sessions.create(payment);

    res.render('checkouts/index',{
        sessionId: paymentSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function(req,res){
    res.render('checkout/success');
})

router.get('/cancel', function(req,res){
    res.render('checkout/cancel')
})

module.exports = router;