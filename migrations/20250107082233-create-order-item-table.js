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

exports.up = function (db) {
  return db.createTable('order_items', {
    'id': {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    'order_id': {
      type: 'int',
      unsigned: true, // Ensures no negative values
      foreignKey: {
        name: 'order_items_order_fk',
        table: 'orders',
        mapping: 'order_id',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    'product_id': {
      type: 'int', notNull: true, unsigned: true,
      foreignKey: {
        name: 'order_items_product_fk',
        table: 'products',
        mapping: 'id',
        rules: { onDelete: 'CASCADE' }
      }
    },
    'product_name': {
      type: 'string',
      length: 255,
      notNull: true,
    },
    'quantity': {
      type: 'int', notNull: true, unsigned: true
    },
    'price_per_unit': {
      type: 'decimal',
      length: [10, 2],
      notNull: true,
      defaultValue: 0.00,
    },
    'subtotal': {
      type: 'decimal',
      length: [10, 2],
      notNull: false, // Explicitly define it, but will be generated
      generated: {
        as: 'quantity * price_per_unit', // Computed logic
        stored: true, // Use `stored` to persist the computed value
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable('order_items');
};

exports._meta = {
  "version": 1
};
