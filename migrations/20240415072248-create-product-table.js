'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// the `up` function contains the changes that we want to make
// to the database
exports.up = function (db) {
  /*
    CREATE TABLE products (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL
      cost INT,
      DESCRIPTION TEXT
    ) engine = innodb;
  */

  // first argument: the name of the table
  // second arugment: object that defines the columns of the table
  // (each key is one column)
  return db.createTable('products', {
    'id': {
      'type':'int',
      'primaryKey': true,
      'autoIncrement': true,
      'unsigned': true
    },
    'name': {
      'type':'string',
      'length': 100,
      'notNull': true
    },
    'cost': {
      'type':'int',
      'unsigned': true
    },
    'description':{
      'type': 'text',
      'notNull': true
    }
  })
};

// the `down` function reverts changes done to the database
exports.down = function (db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
