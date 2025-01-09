'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};
exports.up = function (db) {
  return db.createTable('order_items', {
    order_item_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true, // Ensures no negative values
    },
    order_id: {
      type: 'int',
      notNull: true, // Ensures this is a valid foreign key
      unsigned: true, // Ensures no negative values
    },
    product_name: {
      type: 'string',
      length: 255,
      notNull: true, // Product name is required
    },
    quantity: {
      type: 'int',
      notNull: true, // Quantity is required
      unsigned: true, // Ensures no negative values
    },
    price_per_unit: {
      type: 'decimal',
      length: [10, 2], // Precision 10, Scale 2
      notNull: true, // Price per unit is required
    },
    subtotal: {
      type: 'decimal',
      length: [10, 2], // Precision 10, Scale 2
      notNull: true, // Subtotal is required
    },
  }).then(() => {
    return db.addForeignKey(
      'order_items', // Source table
      'orders',      // Target table
      'fk_order_items_orders', // Constraint name
      {
        order_id: 'order_id', // Match columns
      },
      {
        onDelete: 'CASCADE', // Optional: Delete related items when the order is deleted
        onUpdate: 'RESTRICT', // Optional: Prevent updating the order ID
      }
    );
  });
};

exports.down = function (db) {
  return db.removeForeignKey('order_items', 'fk_order_items_orders') // Remove the foreign key first
    .then(() => db.dropTable('order_items')); // Then drop the table
};


exports._meta = {
  "version": 1
};
