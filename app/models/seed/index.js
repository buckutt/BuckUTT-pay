// Pay - /app/models/seed/index.js

// Seeds regroupment file

'use strict';

module.exports = function (db) {
    require('./meanOfPayment')(db);
    require('./associations')(db);
    require('./events')(db);
    require('./price')(db);
    require('./tickets')(db);
    require('./domains')(db);
};

