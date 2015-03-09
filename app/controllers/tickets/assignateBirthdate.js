/////////////////////////////
// Ticket birthdate setter //
/////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            console.dir(req.form.errors);
            return Error.emit(res, 400, '400 - Bad Request');
        }

        // Get etu id from etu card number
        rest.get('meanofloginsusers?data=' + req.form.etu_id)
        .then(function (mRes) {
            return mRes.data.data;
        })
        .then(function (mol) {
            if (!mol || !mol.UserId) {
                return Error.emit(res, 404, '404 - Not Found', 'No user to get last ticket');
            }

            return rest.get('users?id=' + mol.UserId);
        })
        .then(function (uRes) {
            // /!\ Sequelize does not support ORDER BY in UPDATE statement
            // See :
            // https://github.com/sequelize/sequelize/issues/3307
            // 
            // db.Ticket.update({ birthdate: req.form.birthdate }, {
            //     where: {
            //         username: uRes.data.data.id
            //     },
            //     limit: 1,
            //     order: [['created_at', 'ASC']]
            // });
            // 
            // Meanwhile, let's just do raw queries

            return db.sequelize.query(
                'UPDATE `Tickets` SET `birthdate`="' + req.form.birthdate + '"' +
                ' WHERE `username`=' + uRes.data.data.id +
                ' ORDER BY `created_at` ASC LIMIT 1');
        })
        .then(function (ticket) {
            res.json({
                status: 200,
                id: ticket.id
            });
        })
        .catch(function (err) {
            console.dir(err);
            return Error.emit(res, 500, '500 - SQL Server error', err.toString());
        });
    };
};
