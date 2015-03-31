/////////////////////////
// Event ticket getter //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        db.Ticket
            .find({
                where: { id: req.params.id },
                include: [ db.Price ]
            })
            .then(function (ticket) {
                if (!ticket) {
                    return res
                            .status(404)
                            .end();
                }

                if (ticket.username !== req.user.id)  {
                    return res
                            .status(401)
                            .end();
                }

                ticket.receiptTicket = config.sherlocks.host + 'receipt/' + req.params.id;
                res.json(ticket);
            })
            .catch(function (err) {
                return Error.emit(res, 500, '500 - SQL Server error', err);
            });
    };
};
