// Seeds regroupment file //
////////////////////////////

'use strict';

module.exports = function (db) {
    require('./events')(db);
    require('./price')(db);
    require('./tickets')(db);
    require('./domains')(db);
    require('./rights')(db);
};

