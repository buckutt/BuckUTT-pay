// Seeds regroupment file //
////////////////////////////

'use strict';

module.exports = function (db) {
    require('./events')(db);
    require('./price')(db);
    require('./tickets')(db);
    require('./rights')(db);
    require('./domains')(db);
    require('./accounts')(db);
};

