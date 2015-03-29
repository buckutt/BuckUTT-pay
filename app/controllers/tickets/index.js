////////////////////////
// Tickets controller //
////////////////////////

'use strict';

module.exports = function (db, config) {
    return {
        getAllFromEvent:     require('./getAllFromEvent')(db),
        generatePrintLink:   require('./generatePrintLink')(db, config),
        forgot:              require('./forgot')(db, config),
        getPrice:            require('./getPrice')(db, config),
        create:              require('./create')(db, config),
        assignateCard:       require('./assignateCard')(db, config),
        assignateBirthdate:  require('./assignateBirthdate')(db, config),
        checkMail:           require('./checkMail')(db, config),
        getExtPrice:         require('./getExtPrice')(db, config),
        makeTicketFromAdmin: require('./makeTicketFromAdmin')(db, config)
    };
};
