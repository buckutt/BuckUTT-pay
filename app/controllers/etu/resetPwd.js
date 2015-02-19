///////////////////////////////
// Changes the user password //
///////////////////////////////

'use strict';

var bcrypt = require('bcryptjs');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var pwd   = req.form.password;
        var token = req.params.token;

        db.Token.find({
            where: {
                reset: token
            }
        }).complete(function (err, token) {
            if (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (!token) {
                return Error.emit(res, 401, '401 - Unauthorized', 'Bad token');
            }

            var mail = token.usermail;

            var hash = bcrypt.hashSync(pwd, config.bcryptCost);

            rest.get('users?mail=' + mail).then(function (uRes) {
                return uRes.data.id;
            }, function () {
                return Error.emit(res, 500, '500 - Buckutt server error', 'Get id from email failed');
            }).then(function (id) {
                rest.put('users/' + id, {
                    password: hash
                }).then(function () {
                    res.json({
                        status: 200
                    });
                }, function () {
                    return Error.emit(res, 500, '500 - Buckutt server error', 'Password change failed');
                })
            })
        });
    };
};
