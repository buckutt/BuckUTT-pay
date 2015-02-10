////////////////////
// Etu controller //
////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        login:       require('./login')(db, config),
        searchUsers: require('./searchUsers')(db, config),
        block:       require('./block')(db, config),
        sendReset:   require('./sendReset')(db, config),
        resetPwd:    require('./resetPwd')(db, config)
    };
};
