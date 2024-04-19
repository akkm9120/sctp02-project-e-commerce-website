// in the Bookshelf ORM (and MOST ORM), a model
// represents one TABLE in your database
// you issue commands (in JavaScript) on the model, and the model
// translate your commands to SQL (or whatever DB you are using)

// when you require a file, and it's a js file, you can omit the extension
// instead of `const bookshelf = require('../bookshelf/index.js')`
// => const bookshelf = require('../bookshelf/index')
// when you requring a file in a FOLDER and the file is `index`
// you can omit the `index` (you omit the filename)
const bookshelf = require('../bookshelf');

// create a Product model
// one Model represents one table in your database
// first argument: name of your model
// second argument: a configuration object
const Product = bookshelf.model('Product', {
    tableName:'products',
    // relationships in Bookmodel model are represented by functions
    // the name of the FK column should be the table name with _id at the back, singular.
    // the name of the FK should be the Model name of the other party but in small case, and singular
    category:function() {
        return this.belongsTo('Category'); // one Product model instance belongs to one Category
    },
    tags:function() {
        return this.belongsToMany('Tag');
    }
} );

// and model name keep to singular form of the table name
// but the first alphabet case is upper case
const Category = bookshelf.model('Category', {
    // table name should always be plural
    tableName: 'categories',
    // the name of the relationship is plural form of the model name
    products:function() {
        return this.hasMany('Product');
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product');
    }
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

const CartItem = bookshelf.model('CartItem',{
    tableName:'cart_items',
    product:function() {
        return this.belongsTo('Product');
    },
    user:function() {
        return this.belongsTo('User');
    }
})

module.exports = { Product, Category, Tag, User, CartItem }