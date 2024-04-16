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
    tableName:'products'
} )

module.exports = { Product }