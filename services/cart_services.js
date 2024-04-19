const cartDataLayer = require('../dal/cart_items');

async function addToCart(userId, productId, quantity) {

    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        // update its quantity by 1
        await cartDataLayer.updateQuantity(userId, productId, cartItem.get('quantity')+1)
    } else {
        await cartDataLayer.createCartItem(userId, productId, quantity);
    }

  
    return true;
}

async function getCart(userId) {
    const cartItems = await cartDataLayer.getCart(userId);

    // example of busienss logic: write the logic to get recommendation based on the content of the shopping cart

    return cartItems;
}

async function removeFromCart(userId, productId) {
    return await cartDataLayer.removeFromCart(userId, productId);
}

async function updateQuantity(userId, productId, newQuantity){
    // ideas for logic:
    // 1. calculate shipping cost
    // 2. make sure there is enough stock
    return await cartDataLayer.updateQuantity(userId, productId, newQuantity);
}

module.exports = {addToCart, getCart, removeFromCart, updateQuantity}