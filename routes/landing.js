const express = require('express');

// create a new router object
const router = express.Router();

// a router object can contain routes
router.get('/', function(req,res){
    res.render('landing/index')
})

router.get('/about-us', function(req,res){
    res.render('landing/about-us')
})

router.get('/contact-us', function(req,res){
    res.render("landing/contact-us");
})

// export out the router object so that `index.js` might use it
module.exports = router