///////////////////////////////
// BuckuttHistory controller //
///////////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
      getPurchasesHistory: require('./getPurchasesHistory')(db, config),
      getReloadsHistory:   require('./getReloadsHistory')(db, config)
    };
};
