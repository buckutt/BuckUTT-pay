/////////////////////
// Sell controller //
/////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        userBuysWithBuckutt: require('./userBuysWithBuckutt')(db, config),
        userBuysWithEeetop:  require('./userBuysWithEeetop')(db, config),
        userBuysWithCard:    require('./userBuysWithCard')(db, config),
        successTransaction:  require('./successTransaction')(db, config),
        redirectToSuccess:   require('./redirectToSuccess')(db, config)
    };
};
