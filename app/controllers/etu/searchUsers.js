/////////////////////////////////
// Search among back-end users //
/////////////////////////////////

'use strict';

var _       = require('lodash');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest
            .get('users/?lastname=%' + req.query.query + '%')
            .then(function (uRes) {
                var responseData;
                var data = uRes.data.data;

                if (!data) {
                    return res
                            .status(200)
                            .json([])
                            .end();
                }

                if (require('util').isArray(data)) {
                    if (data.length === 0) {
                        return res
                                .status(200)
                                .json([])
                                .end();
                    }

                    responseData = data.map(function (user) {
                        return {
                            id: user.id,
                            fullName: user.firstname.nameCapitalize() + ' ' + user.lastname.nameCapitalize()
                        };
                    });
                } else {
                    if (!data.hasOwnProperty('id')) {
                        return res
                                .status(200)
                                .json([])
                                .end();
                    }

                    responseData = [
                        {
                            id: data.id,
                            fullName: data.firstname.nameCapitalize() + ' ' + data.lastname.nameCapitalize()
                        }
                    ];
                }

                return res
                        .status(200)
                        .json(_.uniq(responseData, 'id'))
                        .end();
            })
            .catch(function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Couldn\'t search user');
            });
    };
};
