/////////////////////
// Sell controller //
/////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        userBuysWithBuckutt: require('./userBuysWithBuckutt')(db, config)
    };
};
