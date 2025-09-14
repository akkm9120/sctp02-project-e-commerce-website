// knex is necessary for bookshelf to work
const knex = require('knex')(
    {
        // client refers to what database technology we are using
        client: process.env.DB_DRIVER || process.env.NODE_ENV === 'production' ? 'mysql2' : 'mysql2',
        connection: process.env.NODE_ENV === 'production' && process.env.MYSQL_URL ? 
            process.env.MYSQL_URL : {
            user: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_USER : process.env.DB_USER,
            password: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_PASSWORD : process.env.DB_PASSWORD,
            database: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_DATABASE : process.env.DB_DATABASE,
            host: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_HOST : process.env.DB_HOST,
            port: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_PORT : process.env.DB_PORT,
            ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false,
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