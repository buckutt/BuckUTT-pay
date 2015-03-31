//////////////////
// Event getter //
//////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.Event
            .find({
                where: {
                    id: req.params.eventId
                },
                include: [ db.Price ]
            })
            .then(function (event) {
                if (!event) {
                    return res
                            .status(404)
                            .end();
                }

                return res
                        .status(200)
                        .json(event || {})
                        .end();
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
