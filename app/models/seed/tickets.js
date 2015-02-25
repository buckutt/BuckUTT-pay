////////////////////////
// Seeds some tickets //
////////////////////////

'use strict';

module.exports = function (db) {
    db.Ticket.create({
        username: 10155,
        displayName: 'Gabriel Juchault',
        student: true,
        contributor: true,
        paid: true,
        paid_at: new Date(),
        paid_with: 'buckutt',
        temporarlyOut: false,
        barcode: '3780173904905',
        validatedMap: null
    }).complete(function (err, galaGJ) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error', err.toString());
        }

        db.Price.find({ name: 'Gala 2015 - Prix étudiant cottisant en prévente' }).complete(function (err, price) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            galaGJ.setPrice(price);
        });

        db.Event.find({ name: 'Gala 2015' }).complete(function (err, gala2015) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            galaGJ.setEvent(gala2015);
        });

        db.MeanOfPayment.find({ name: 'Buckutt' }).complete(function (err, buckutt) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            galaGJ.setMeanOfPayment(buckutt);
        });
    });
};
