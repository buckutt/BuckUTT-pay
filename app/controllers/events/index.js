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
        editPrice:   require('./editPrice')(db, config),
        createPrice: require('./createPrice')(db, config),
        remove:      require('./remove')(db, config)
    };
};
