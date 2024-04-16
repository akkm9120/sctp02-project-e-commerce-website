// all default starting file of
// a nodejs module is `index.js`

// knex is necessary for bookshelf to work
const knex = require('knex')(
    {
        // client refers to what database technology we are using
        client: 'mysql',
        connection: {
            user: 'foo',
            password:'bar',
            database:'organic',
            host:'127.0.0.1'   // aka 'localhost'
        }
    }
);

// create bookshelf
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;