///////////////////////
// Reload controller //
///////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        reload:            require('./reload')(db, config),
        successReload:     require('./successReload')(db, config),
        redirectToSuccess: require('./redirectToSuccess')(db, config)
    };
};
