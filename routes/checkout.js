const express = require('express');
const router = express.Router();
const { checkIfAuthenticated } = require('../middlewares');

// cart service layer
const cart = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', [checkIfAuthenticated], async function (req, res) {
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
                    metadata: {
                        product_id: i.get('product_id')
                    }
                }
            }
        }

        // if the product has an image, add it to the invoice as well
        if (i.related('product').get('image_url')) {
            lineItem.price_data.product_data.images = [i.related('product').get('image_url')];
        }

        // push the finished line item into the array
        lineItems.push(lineItem);
    }
    // 2. create a payment session
    const payment = {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metadata: {
            user_id: req.session.user.id
        }
    }

    // 3. register the payment session with stripe and return its id
    const paymentSession = await Stripe.checkout.sessions.create(payment);

    res.render('checkouts/index', {
        sessionId: paymentSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function (req, res) {
    res.render('checkout/success');
})

router.get('/cancel', function (req, res) {
    res.render('checkout/cancel')
})

// This route is the webhook for Stripe to call when a payment is successful
// It has to follow some specific guidelines from Stripe
// 1. It has to be a POST method
// 2. It has to use the express.raw({type:'application/json'}) 
//    Cannot use express.json() because the request sent by Stripe has lot of special characters
//    which express.json() will malform if we use it
router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {

    const payload = req.body;

    // retrieve our endpoint secret
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

    // signature header (Stripe will provide one in the request)
    const sigHeader = req.headers['stripe-signature'];

    let event = null;

    try {
        // reconstruct the payment event from the payload
        // and also verify that the signature and endpoint secret matches

        // 1. need to extract payload and verify that this request is actually from Stripe
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

        // 2. we retrieve the payment session (which we sent to Stripe to get payment for)
        // and retrieve the payment information (including what the user has ordered)
        if (event.type == 'checkout.session.completed') {
            const stripeSession = event.data.object; // this is a stripped-down, limited version of Session
            
            // grab the full payment session, along with the line items
            // but this will only grab minimal information about the line items
            const session = await Stripe.checkout.sessions.retrieve(
                stripeSession.id, {
                    expand: ['line_items']
                }
            );

            // grab the full information about the line items
            const lineItems = await Stripe.checkout.sessions.listLineItems(stripeSession.id, {
                expand: ['data.price.product']
            });

            // 3. process order
            console.log("Session =", session);
            console.log("Line Items =", lineItems);

            // 4. send a request back to Stripe
            res.json({
                'status': 'Success'
            })
        }
    } catch (e) {
        // if an exception it means the event is not from Stripe
        res.status(500).json({
            error: e
        })
    }



   
})

module.exports = router;