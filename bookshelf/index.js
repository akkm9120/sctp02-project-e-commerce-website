// knex is necessary for bookshelf to work
const knex = require('knex')(
    {
        // client refers to what database technology we are using
        client: process.env.DB_DRIVER,
        connection: {
            user: process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_DATABASE,
            host:process.env.DB_HOST,
            port:process.env.DB_PORT,
            ssl: process.env.DB_HOST !== 'localhost' ? {rejectUnauthorized: false} : false,
            connectTimeout: 60000,
            acquireConnectionTimeout: 60000,
            timeout: 60000
        },
        pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 60000,
            createTimeoutMillis: 30000,
            destroyTimeoutMillis: 5000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100
        }
    }
  );
  
  // create bookshelf
  const bookshelf = require('bookshelf')(knex);
  
  module.exports= bookshelf;