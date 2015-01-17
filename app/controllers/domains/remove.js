////////////////////
// Domain remover //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain.find(req.params.domainId).complete(function (err, domain) {
            if (err) {
                Error.emit(res, 500, '500 - SQL Error', err.toString());
                return;
            }

            domain.destroy().complete(function (errDestroy) {
                if (errDestroy) {
                    Error.emit(res, 500, '500 - SQL Error', err.toString());
                    return;
                }

                res.json({
                    status: 200
                });
            });
        });
    };
};
