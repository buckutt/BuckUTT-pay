///////////////////////////////////
// Ticket validator by ticket id //
///////////////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        var id = req.params.id;

        db.Ticket.find(id).complete(function (err, ticket) {
            if (err || !ticket) {
                return res.status(401).end();
            }

            var values = (ticket.dataValues) ? ticket.dataValues : ticket;

            if (!values.paid || !values.paid_at || !values.paid_with) {
                return res.status(402).end();
            }

            if (values.validatedDate) {
                return res.status(409).end();
            }

            ticket.validatedDate = new Date();
            ticket.save();

            res.status(200).end(ticket.displayName);
        });
    };
};
