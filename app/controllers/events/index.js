// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var getAll      = require('./getAll');
var getOne      = require('./getOne');
var create      = require('./create');
var edit        = require('./edit');
var editPrice   = require('./editPrice');
var createPrice = require('./createPrice');
var remove      = require('./remove');

module.exports = function (db, config) {
    return {
        getAll: getAll(db, config),
        getOne: getOne(db, config),
        create: create(db, config),
        edit: edit(db, config),
        editPrice: editPrice(db, config),
        createPrice: createPrice(db, config),
        remove: remove(db, config)
    };
};
