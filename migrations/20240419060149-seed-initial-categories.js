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

exports.up = async function(db) {
  await db.insert('categories', ['name'], ['Starch']);
  await db.insert('categories', ['name'], ['Meat Replacements']);
  await db.insert('categories', ['name'], ['Beverages']);
  await db.insert('categories', ['name'], ['Snacks']);
};

exports.down = function(db) {
  return db.runQuery("DELETE FROM categories");
};

exports._meta = {
  "version": 1
};
