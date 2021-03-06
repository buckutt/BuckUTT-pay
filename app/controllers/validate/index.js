/////////////////////////
// Validate controller //
/////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        validateId:       require('./validateId')(db, config),
        validateName:     require('./validateName')(db, config),
        validateTicketId: require('./validateTicketId')(db, config)
    };
};
