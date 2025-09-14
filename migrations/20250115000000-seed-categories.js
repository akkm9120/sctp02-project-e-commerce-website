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
  return db.runSql(`
    INSERT INTO categories (id, name) VALUES 
    (1, 'Vegan'),
    (2, 'Non-Vegan')
    ON DUPLICATE KEY UPDATE name = VALUES(name);
  `);
};

exports.down = function (db) {
  return db.runSql(`
    DELETE FROM categories WHERE id IN (1, 2);
  `);
};

exports._meta = {
  version: 1,
};