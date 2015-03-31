////////////////////
// Domain remover //
////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        db.SchoolDomain
            .find(req.params.domainId)
            .then(function (domain) {
                domain
                    .destroy()
                    .then(function () {
                        return res
                                .status(200)
                                .end();
                    })
                    .catch(function (err) {
                        return Error.emit(res, 500, '500 - SQL Error', err);
                    });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Error', err);
            });
    };
};
