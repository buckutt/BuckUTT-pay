//////////////////
// Event getter //
//////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event.find({
            where: {
                id: req.body.eventId
            },
            include: [
                db.Price
            ]
        }).done(function (err, event) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Server error', err);
                return;
            }
            
            res.json(event || {});
        });
    };
};
