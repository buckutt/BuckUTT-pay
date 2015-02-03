////////////////////
// Domain remover //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain.find(req.params.domainId).complete(function (err, domain) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Error', err.toString());
            }

            domain.destroy().complete(function (errDestroy) {
                if (errDestroy) {
                    return Error.emit(res, 500, '500 - SQL Error', err.toString());
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
