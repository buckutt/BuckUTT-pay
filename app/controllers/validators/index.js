/////////////////////////////////
// Validators regroupment file //
/////////////////////////////////

'use strict';

module.exports = {
    createAccount:       require('./createAccount'),
    createDomain:        require('./createDomain'),
    createEvent:         require('./createEvent'),
    editBankprice:       require('./editBankprice'),
    editEvent:           require('./editEvent'),
    editPrices:          require('./editPrices'),
    etuLogin:            require('./etuLogin'),
    resetPwd:            require('./resetPwd'),
    createTicket:        require('./createTicket'),
    assignateCard:       require('./assignateCard'),
    assignateBirthdate:  require('./assignateBirthdate'),
    buyTicketBuckutt:    require('./buyTicketBuckutt'),
    buyTicketCard:       require('./buyTicketCard'),
    buyTicketExtCard:    require('./buyTicketExtCard'),
    makeTicketFromAdmin: require('./makeTicketFromAdmin')
};
