/////////////////////////
// Event ticket getter //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    return function (req, res) {
        console.log(req.params);
        db.Ticket.find({
            where: { id: req.params.id },
            include: [ db.Price ]
        }).complete(function (err, ticket) {
            if (err) {
                console.dir(err);
                return Error.emit(res, 500, '500 - SQL Server error', err);
            }

            if (!ticket) {
                return res.status(404).end();
            }

            if (ticket.username !== req.user.id)  {
                return res.status(401).end();
            }

            ticket.receiptTicket = config.sherlocks.host + 'receipt/' + req.params.id;
            res.json(ticket);
        });
    };
};
