///////////////////////
// Report controller //
///////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        report: require('./report')(db, config)
    };
};
