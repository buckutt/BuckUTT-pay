// Pay - /app/controllers/events/index.js

// Events controller

'use strict';

var getAll = require('./getAll');
var getOne = require('./getOne');
var create = require('./create');
var edit   = require('./edit');
var remove = require('./remove');

module.exports = function (db) {
    return {
        getAll: getAll(db),
        getOne: getOne(db),
        create: create(db),
        edit: edit(db),
        remove: remove(db)
    };
};
