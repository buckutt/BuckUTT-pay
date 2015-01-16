///////////////////////
// Seeds some rights //
///////////////////////

'use strict';

module.exports = function (db) {
    db.Right.create({
        admin: true,
        sell: false
    }).complete(function () {
        db.Right.create({
            admin: false,
            sell: true
        });
    });
};
