// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var getAll = require('./getAll');
var getOne = require('./getOne');
var create = require('./create');
var edit   = require('./edit');
var remove = require('./remove');

module.exports = function (db, config) {
    return {
        getAll: getAll(db, config),
        getOne: getOne(db, config),
        create: create(db, config),
        edit: edit(db, config),
        remove: remove(db, config)
    };
};
