///////////////////////
// Barcode generator //
///////////////////////

/**
 * Generates a barcode
 * @param {Function} callback Called when found a valid barcode
 * @param {object}   Ticket   Access to the database
 */
function generateBarcode (callback, Ticket) {
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
            return Error.emit(res, 500, '500 - SQL Server error', err.toString());
        }

        if (count === 0) {
            callback(barcode);
        } else {
            logger.warn('Needed to regenerate barcode.');
            // Barcode already exists, call again
            generateBarcode(callback);
        }
    });
};

module.exports = generateBarcode;
