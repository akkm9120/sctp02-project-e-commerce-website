const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category: function() {
        return this.belongsTo('Category');
    },
    tags: function() {
        return this.belongsToMany('Tag');
    }
});

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    products: function() {
        return this.hasMany('Product');
    }
});

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    products: function() {
        return this.belongsToMany('Product');
    }
});

const User = bookshelf.model('User', {
    tableName: 'users',
    orders: function() {
        return this.hasMany('Order');
    },
    cart_items: function() {
        return this.hasMany('CartItem');
    }
});

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    product: function() {
        return this.belongsTo('Product');
    },
    user: function() {
        return this.belongsTo('User');
    }
});

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    idAttribute: 'order_id',
    orderItems: function() {
        return this.hasMany('OrderItem', 'order_id');
    }
});

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    idAttribute: 'id',
    order: function() {
        return this.belongsTo('Order', 'order_id');
    },
});

module.exports = { Product, Category, Tag, User, CartItem, Order, OrderItem };
