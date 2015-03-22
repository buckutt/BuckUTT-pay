////////////////////////
// Seeds some tickets //
////////////////////////

'use strict';

module.exports = function (db) {
    db.Ticket.create({
        username: 10155,
        displayName: 'Gabriel Juchault',
        mail: 'gabriel.juchault@gmail.com',
        student: true,
        contributor: true,
        paid: true,
        paid_at: new Date(),
        paid_with: 'buckutt',
        temporarlyOut: false,
        barcode: '3780173904905',
        validatedMap: null,
        birthdate: '21/09/1994',
        mainTicket: 0
    }).complete(function (err, galaGJ) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error', err.toString());
        }

        db.Price.find({ name: 'Gala 2015 - Prix étudiant cotisant en prévente' }).complete(function (err, price) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            galaGJ.setPrice(price);
        });

        galaGJ.setEvent(1);
    });

    db.Ticket.create({
        username: 55101,
        displayName: 'Gabriel Juchault',
        mail: 'gabriel.juchault@gmail.com',
        student: true,
        contributor: true,
        paid: true,
        paid_at: new Date(),
        paid_with: 'buckutt',
        temporarlyOut: false,
        barcode: '123456',
        validatedMap: null,
        birthdate: '22/09/1994',
        mainTicket: 0
    }).complete(function (err, galaGJ) {
        if (err) {
            Error.emit(null, 500, '500 - SQL Server error', err.toString());
        }

        db.Price.find({ name: 'Gala 2015 - Prix étudiant cotisant en prévente' }).complete(function (err, price) {
            if (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }

            galaGJ.setPrice(price);
        });

        galaGJ.setEvent(1);
    });
};
