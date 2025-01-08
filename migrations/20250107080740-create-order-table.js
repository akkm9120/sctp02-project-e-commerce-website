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

// CREATE TABLE Orders (
//   OrderID INT AUTO_INCREMENT PRIMARY KEY,      
//   OrderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
//   TotalCost DECIMAL(10, 2) NOT NULL DEFAULT 0.00 
// );

exports.up = function (db) {
  return db.createTable('orders', {
    'order_id': {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true, // Ensures no negative values
    },
    'orderdate': {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP'), // Default to current timestamp
    },
    'totalcost': {
      type: 'decimal',
      length: [10, 2], // Precision 10, Scale 2
      notNull: true,
      defaultValue: 0.00, // Default cost
    },
  });
};

exports.down = function (db) {
  return db.dropTable('orders');
};


exports._meta = {
  "version": 1
};
