const express = require('express');
const router = express.Router();

// require in the model
const { Product } = require('../models');

router.get('/', async function(req,res){
    // use the Product model to get all the products
    const products = await Product.collection().fetch();
    // products.toJSON() convert the table rows into JSON data format
    res.render('products/index', {
        products: products.toJSON()
    } );
});

router.get('/add-product', function(req,res){
    res.send('Add product')
});

// export
module.exports = router;