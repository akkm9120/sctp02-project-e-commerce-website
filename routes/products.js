const express = require('express');
const router = express.Router();

// require in the model
const { Product, Category, Tag } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');

router.get('/', async function(req,res){
    // use the Product model to get all the products
    const products = await Product.collection().fetch({
        withRelated:['category', 'tags']
    });
    // products.toJSON() convert the table rows into JSON data format
    res.render('products/index', {
        products: products.toJSON()
    } );
});

router.get('/add-product', async function(req,res){

    // get all the categories
    const allCategories = await Category.fetchAll().map( category => [ category.get('id'), category.get('name')]);

    // get all the tags 
    const allTags = await Tag.fetchAll().map (t => [t.get('id'), t.get('name')]);

    const productForm = createProductForm(allCategories, allTags);
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/add-product', async function(req,res){

     // get all the categories
     const allCategories = await Category.fetchAll().map( category => [ category.get('id'), category.get('name')]);

     // get all the tags 
     const allTags = await Tag.fetchAll().map (t => [t.get('id'), t.get('name')]);

    // create the product form object using caolan form
    const productForm = createProductForm(allCategories, allTags);
    // using the form object to handle the request
    productForm.handle(req, {
        'success': async function(form) {
            // the forms has no error
            // to access each field in the submitted form
            // we use form.data.<fieldname>


            // create an instance of the Product model
            // an instance of a product is one row in the corresponding table
            const product = new Product();
            product.set('name', form.data.name)
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('category_id', form.data.category_id)
            product.set('image_url', form.data.image_url);
            // save the product to the database
            await product.save();

            // same as:
            // INSERT INTO products (name, cost, description)
            // VALUES (${form.data.name}, ${form.data.cost}, ${form.data.description})
           
            // save the tags relationship
            if (form.data.tags) {
                // form.data.tags will be a string of the selected tag ids seperated by comma
                // eg: "1,2"
                await product.tags().attach(form.data.tags.split(','));
            }
            
            // a flash message can only be set before a redirect
            // req.flash has two arugments: 
            // 1st: the type of message to show (it's up to the developer to define)
            // 2nd: what message to show
            // req.flash will add a new flash message to the current session
            req.flash('success_messages', 'New product has been created successfully');
            res.redirect("/products/");
        },
        'empty': function(form) {
            // the user submitted an empty form
            res.render('products/create', {
                form: productForm.toHTML(bootstrapField)
            })
        },
        'error': function(form) {
            // the user submitted a form with error
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/update-product/:productId', async function(req,res){
    const productId = req.params.productId;

    // fetch the product that we want to update
    // emulate: SELECT * from products WHERE id = ${productId}
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['tags']  // when fetching the products, also fetch tags information
    });

    // get all the categories
    const allCategories = await Category.fetchAll().map( category => [ category.get('id'), category.get('name')]);

     // get all the tags 
     const allTags = await Tag.fetchAll().map (t => [t.get('id'), t.get('name')]);

    // create the product form
    const productForm = createProductForm(allCategories, allTags);

    // prefill the form with values from the product 
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    // get the ids of all the tags that the product is related to
    const selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/update-product/:productId', async function(req,res){
    // 1. create the form object
    const productForm = createProductForm();

    // 2. use the form object to handle the request
    productForm.handle(req, {
        'success':async function(form) {
            // find the product that the user want to modify
            const product = await Product.where({
                'id': req.params.productId
            }).fetch({
                withRelated:['tags'],
                require: true  // make sure the product actually exists
            });

            // if every key in form.data is one column in a product row,
            // we can use the following shortcut:
            const {tags, ...productData} = form.data;
            product.set(productData);
            await product.save();

            // update the relationships
            
            // 1. convert the tags from string to array (tags will contain a string "1,2")
            const tagIds = tags.split(',');

            // 2. remove all the tags
            // ...get an array of the ids of the tags related to the product
            const existingTagIds = await product.related('tags').pluck('id');
            console.log(existingTagIds);
            await product.tags().detach(existingTagIds);  // detach is to remove from a M:N relationship

            await product.tags().attach(tagIds);

            res.redirect('/products/')
        },
        'empty': function(form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function(form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/delete-product/:productId', async function(req,res){
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    res.render('products/delete', {
        product: product.toJSON(),
    })

})

router.post('/delete-product/:productId', async function(req,res){
    // get the product which we want to delete
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    req.flash('error_messages', `${product.get('name')} has been deleted`);
    await product.destroy();
    res.redirect('/products');


})

// export
module.exports = router;