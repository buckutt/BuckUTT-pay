////////////////////
// Ticket printer //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        res.json(req.query);
    };
};
