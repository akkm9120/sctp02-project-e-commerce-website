const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary');
cloudinary.config({
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET
});

// the /sign route will be called by the
// Cloudinary Upload Widget
router.get('/sign', async function(req,res){
    // the params_to_sign is from the
    // Cloudinary Upload Widget
    const params = req.query.params_to_sign;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    // the signature is similiar to CSRF protection
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    res.send(signature);
})

module.exports = router;