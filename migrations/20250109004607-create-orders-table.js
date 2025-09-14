"use strict";

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
  return db.createTable("orders", {
    order_id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true, // Ensures no negative values
    },
    order_date: {
      type: "datetime",
      notNull: true,
    },
    total_cost: {
      type: "decimal",
      length: [10, 2], // Precision 10, Scale 2
      notNull: true,
    },
    delivery_date: {
      type: "date",
      notNull: true,
    },
    delivery_time: {
      type: "time",
      notNull: true,
    },
    delivery_address: {
      type: "string",
      length: 255,
      notNull: true,
      defaultValue: "",
    },
  });
};

exports.down = function (db) {
  return db.dropTable("orders");
};

exports._meta = {
  version: 1,
};
