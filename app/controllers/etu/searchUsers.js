/////////////////////////////////
// Search among back-end users //
/////////////////////////////////

'use strict';

var request = require('request');
var _       = require('lodash');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        rest.get('users/?lastname=%' + req.query.query + '%').success(function (data) {
            var responseData;

            if (!data) {
                res.json([]);
                return;
            }

            if (require('util').isArray(data)) {
                if (data.length === 0) {
                    res.json([]);
                    return;
                }

                responseData = data.map(function (user) {
                    return {
                        id: user.id,
                        fullName: user.firstname.nameCapitalize() + ' ' + user.lastname.nameCapitalize()
                    };
                });
            } else {
                if (!data.hasOwnProperty('id')) {
                    res.json([]);
                    return;
                }

                responseData = [
                    {
                        id: data.id,
                        fullName: data.firstname.nameCapitalize() + ' ' + data.lastname.nameCapitalize()
                    }
                ];
            }

            res.json(_.uniq(responseData, 'id'));
        }).error(function () {
            return Error.emit(res, 500, '500 - Buckutt server error', 'Search failed');
        });
    }
};
