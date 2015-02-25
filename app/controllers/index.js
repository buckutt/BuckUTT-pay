//////////////////////////////////
// Controllers regroupment file //
//////////////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        tickets:        require('./tickets')(db, config),
        events:         require('./events')(db, config),
        etu:            require('./etu')(db, config),
        domains:        require('./domains')(db, config),
        bankPrice:      require('./bankPrice')(db, config),
        accounts:       require('./accounts')(db, config),
        buckuttHistory: require('./buckuttHistory')(db, config),
        vendor:         require('./vendor')(db, config)
    };
};
