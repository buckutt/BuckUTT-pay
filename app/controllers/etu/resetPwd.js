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

        db.Token
            .find({
                where: {
                    reset: token
                }
            })
            .then(function (token) {
                if (!token) {
                    return Error.emit(res, 401, '401 - Unauthorized', 'Couldn\'t reset password : wrong token');
                }

                token.destroy();

                var mail = token.usermail;

                var hash = bcrypt.hashSync(pwd, config.bcryptCost);

                rest
                    .get('users?mail=' + mail)
                    .then(function (uRes) {
                        return uRes.data.data.id;
                    })
                    .catch(function (err) {
                        return Error.emit(res, 500, '500 - Buckutt server error', err);
                    })
                    .then(function (id) {
                        return rest.put('users/' + id, {
                            password: hash
                        });
                    })
                    .then(function () {
                        return res
                                .status(200)
                                .end();
                    })
                    .catch(function (err) {
                        return Error.emit(res, 500, '500 - Buckutt server error', err);
                    });
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
