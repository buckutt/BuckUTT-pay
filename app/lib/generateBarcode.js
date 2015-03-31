///////////////////////
// Barcode generator //
///////////////////////

'use strict';

/**
 * Generates a barcode
 * @param {Function} callback    Called when found a valid barcode
 * @param {Function} callbackErr Called when and error occurs
 * @param {object}   Ticket      Access to the database
 */
function generateBarcode (callback, callbackErr, Ticket) {
    var base = 989000000000;
    var max =     999999999;
    var min =             0;

    var number = Math.floor(Math.random() * (max - min + 1) + min);
    var barcode = base + number;

    Ticket.count({
        where: {
            barcode: barcode
        }
    }).complete(function (err, count) {
        if (err) {
            return callbackErr(err);
        }

        if (count === 0) {
            callback(barcode);
        } else {
            // Barcode already exists, call again
            generateBarcode(callback);
        }
    });
}

module.exports = generateBarcode;
