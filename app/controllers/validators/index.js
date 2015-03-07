/////////////////////////////////
// Validators regroupment file //
/////////////////////////////////

'use strict';

module.exports = {
    createAccount: require('./createAccount'),
    createDomain:  require('./createDomain'),
    createEvent:   require('./createEvent'),
    createPrice:   require('./createPrice'),
    editBankprice: require('./editBankprice'),
    editEvent:     require('./editEvent'),
    editPrice:     require('./editPrice'),
    etuLogin:      require('./etuLogin'),
    resetPwd:      require('./resetPwd'),
    createTicket:  require('./createTicket')
};
