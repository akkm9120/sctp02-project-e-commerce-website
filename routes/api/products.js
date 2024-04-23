const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products');
const { createProductForm } = require('../../forms');


router.get('/', async function(req,res){
    const allProducts = await productDataLayer.getAllProducts();
    res.json({
        products: allProducts
    })
});

router.post('/', async function(req,res){
    try {
        const allCategories = await productDataLayer.getAllCategories();
        const allTags = await productDataLayer.getAllTags();
        const productForm = createProductForm(allCategories, allTags);
    
        productForm.handle(req,{
            "success": async function(form) {
                const product = await productDataLayer.createProduct(form.data);
                res.json({
                    product: product.toJSON()
                })
            },
            "error": async function(form) {
                // extract the errors message from the form
                // and send it as an object in the JSON format
                const errors = {};
                for (let key in form.fields) {
                    // for each form field, check if it has an error
                    if (form.fields[key].error) {
                        errors[key] = form.fields[key].error;
                    }
                }
                res.status(400);
                res.json({
                    'errors': errors
                })
            },
            "empty": async function(form) {
                res.status(400);
                res.json({
                    'error':"Empty request recieved"
                })
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500);
        res.json({
            'error': e
        })
    }
   
})

module.exports = router;