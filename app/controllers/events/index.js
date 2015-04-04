///////////////////////
// Events controller //
///////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        getAll:      require('./getAll')(db, config),
        getOne:      require('./getOne')(db, config),
        create:      require('./create')(db, config),
        edit:        require('./edit')(db, config),
        editPrices:  require('./editPrices')(db, config),
        remove:      require('./remove')(db, config),
        getPrices:   require('./getPrices')(db, config)
    };
};
