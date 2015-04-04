///////////////////////////////////
// Ticket validator by ticket id //
///////////////////////////////////

'use strict';

module.exports = function (db) {
    return function (req, res) {
        var id = req.params.ticketId;

        db.Ticket
            .find(id)
            .then(function (ticket) {
                if (!ticket) {
                    return res
                            .status(401)
                            .end();
                }

                if (!ticket.paid || !ticket.paid_at || !ticket.paid_with) {
                    return res
                            .status(402)
                            .end();
                }

                if (ticket.validatedDate) {
                    return res
                            .status(409)
                            .end();
                }

                ticket.validatedDate = new Date();
                ticket.save();

                return res
                        .status(200)
                        .end(ticket.displayName);
            })
            .catch(function () {
                return res
                        .status(401)
                        .end();
            });
    };
};
