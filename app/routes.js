/////////////
// Routing //
/////////////

'use strict';

var validators = require('./controllers/validators');
var validator  = require('validator');

module.exports = function (router, servicesRouter, db, config) {
    var controllers = require('./controllers')(db, config);
    var auth        = require('./lib/auth')(db, config);

    // Main auth
    // Checks if there is a token every request
    router.use(auth.checkToken);

    ////////////
    // Events //
    ////////////

    router.route('/events').
        // Gets all events
        get(
            auth.noAuth,
            controllers.events.getAll
        )
        // Creates an event
        .post(
            auth.isFundationAccount,
            validators.createEvent,
            controllers.events.create
        )
        // Updates an event
        .put(
            auth.isInEvent('admin'),
            validators.editEvent,
            controllers.events.edit
        );

    router.route('/events/:eventId')
        // Deletes an event
        .delete(
            auth.isInEvent('admin'),
            controllers.events.remove
        )
        // Gets an event's details
        .get(
            auth.isInEvent('admin'),
            controllers.events.getOne
        );

    /////////////////////
    // Event's tickets //
    /////////////////////

    router.route('/events/:eventId/tickets')
        // Gets all tickets from an event (stats)
        .get(
            auth.isInEvent('admin'),
            controllers.tickets.getAllFromEvent
        );

    ////////////////////
    // Event's prices //
    ////////////////////

    router.route('/events/:eventId/prices')
        .get(
            auth.isInEvent('validate'),
            controllers.events.getPrices
        )
        // Updates an event price
        .post(
            auth.isInEvent('admin'),
            validators.editPrices,
            controllers.events.editPrices
        );


    //////////////////////
    // Event's accounts //
    //////////////////////

    router.route('/etu/search/')
        // Searches among users list
        .get(
            auth.isInEvent('admin'),
            controllers.etu.searchUsers
        );

    router.route('/events/:eventId/accounts')
        // Create an account
        .post(
            auth.isFundationAccount,
            validators.createAccount,
            controllers.accounts.create
        )
        // Get all the accounts
        .get(
            auth.isFundationAccount,
            controllers.accounts.getAll
        );
    router.route('/accounts/:accountId')
        // Deletes an account
        .delete(
            auth.isFundationAccount,
            controllers.accounts.remove
        );
    router.route('/accounts/:userId')
        // Gets all accounts with a given user id
        .get(
            auth.noAuth,
            controllers.accounts.getAllFromUserId
        );

    /////////////
    // Tickets //
    /////////////

    router.route('/tickets')
        // Creates a ticket (sell)
        .post(
            auth.isInEvent('validate'),
            validators.createTicket,
            controllers.tickets.create
        );

    router.route('/ticket/:id')
        // Gets one ticket (invoice)
        .get(
            auth.isAuth,
            controllers.tickets.getOne
        );

    router.route('/makeTicketFromAdmin')
        // Creates a ticket (admin's making one)
        .post(
            auth.noAuth,
            validators.makeTicketFromAdmin,
            controllers.tickets.makeTicketFromAdmin
        );

    router.route('/assignateCard/:eventId')
        // Sets the barcode of one ticket
        .post(
            auth.isInEvent('validate'),
            validators.assignateCard,
            controllers.tickets.assignateCard
        );

    router.route('/assignateBirthdate/:eventId')
        // Sets the barcode of one ticket
        .post(
            auth.isInEvent('validate'),
            validators.assignateBirthdate,
            controllers.tickets.assignateBirthdate
        );

    router.route('/sendCheckMail/:eventId/:mail')
        // Sends a mail and create a token
        .post(
            auth.noAuth,
            controllers.tickets.checkMail
        );

    /////////////////////
    // Ticket's prices //
    /////////////////////

    router.route('/price/:eventId')
        // Gets an event price
        .get(
            auth.noAuth,
            controllers.tickets.getPrice
        );

    router.route('/priceExt/:eventId')
        // Gets an event price
        .get(
            auth.noAuth,
            controllers.tickets.getExtPrice
        );

    ////////////////////
    // School domains //
    ////////////////////

    router.route('/domains/')
        // Gets all domains
        .get(
            auth.isSuperAdmin,
            controllers.domains.getAll
        )
        // Creates a domain
        .post(
            auth.isSuperAdmin,
            validators.createDomain,
            controllers.domains.create
        );
    router.route('/domains/:domainId')
        // Deletes a domain
        .delete(
            auth.isSuperAdmin,
            controllers.domains.remove
        );

    ////////////////
    // Bank Price //
    ////////////////

    router.route('/bankPrice/')
        .get(
            auth.isAuth,
            controllers.bankPrice.get
        )
        .post(
            auth.isSuperAdmin,
            validators.editBankprice,
            controllers.bankPrice.edit
        );

    //////////
    // User //
    //////////

    router.route('/etu/login')
        // Auth etu
        .post(
            auth.noAuth,
            validators.etuLogin,
            controllers.etu.login,
            auth.addAuth
        );

    router.route('/etu/block')
        .put(
            auth.isAuth,
            controllers.etu.block
        );

    router.route('/generatePrintLink/:ticketId')
        // Ticket print link generator
        .get(
            auth.isAuth,
            controllers.tickets.generatePrintLink
        );

    router.route('/forgot/:mail')
        // Forgot tickets
        .get(
            auth.noAuth,
            controllers.tickets.forgot
        );

    router.route('/reset/:mail')
        // Send the reset mail
        .post(
            auth.noAuth,
            controllers.etu.sendReset
        );
    router.route('/reset/:token')
        // Changes the password (needs :token to avoid validation)
        .put(
            auth.noAuth,
            validators.resetPwd,
            controllers.etu.resetPwd
        );

    router.route('/purchases/')
        // Buckutt History - Purchases
        .get(
            auth.isAuth,
            controllers.buckuttHistory.getPurchasesHistory
        );
    router.route('/reloads/')
        // Buckutt History - Reloads
        .get(
            auth.isAuth,
            controllers.buckuttHistory.getReloadsHistory
        );

    router.route('/getUsername/:id')
        // Get buckutt id from etu card number
        .get(
            auth.isAuth,
            controllers.etu.getUsername
        );

    //////////////
    // Validate //
    //////////////

    router.route('/validate/byTicketId/:eventId/:ticketId')
        // Validate id
        .post(
            auth.isInEvent('validate'),
            controllers.validate.validateTicketId
        );

    router.route('/validate/:eventId/:id')
        // Validate id
        .post(
            auth.isInEvent('validate'),
            controllers.validate.validateId
        );

    router.route('/validate/byName/:eventId/:name')
        // Validate id
        .post(
            auth.isInEvent('validate'),
            controllers.validate.validateName
        );
    ////////////////////
    // Ticket selling //
    ////////////////////

    router.route('/buy/buckutt/:eventId')
        // User buys one ticket with his buckutt
        .post(
            auth.isAuth,
            validators.buyTicketBuckutt,
            controllers.sell.userBuysWithBuckutt
        );

    router.route('/buy/eeetop/')
        // Route used by eee-tops to signal a payment
        .post(
            auth.noAuth,
            controllers.sell.userBuysWithEeetop
        );

    router.route('/buy/card/:eventId')
        // Route used by users that pay with card login
        .post(
            auth.isAuth,
            validators.buyTicketCard,
            controllers.sell.userBuysWithCard(false)
        );

    router.route('/buy/card/ext/:eventId')
        // Route used by users that pay with card without login
        .post(
            auth.noAuth,
            validators.buyTicketExtCard,
            controllers.sell.userBuysWithCard(true)
        );

    router.route('/successTransaction/')
        // Success callback from the bank
        .post(
            auth.noAuth,
            controllers.sell.successTransaction,
            controllers.etu.login,
            auth.addAuth,
            controllers.sell.redirectToSuccess
        );

    //////////////////
    // User reloads //
    //////////////////
    router.route('/reload/:amount')
        // Generates a sherlocks form
        .get(
            auth.isAuth,
            controllers.reload.reload
        );
    router.route('/successReload/')
        // Validates the payment
        .post(
            auth.noAuth,
            controllers.reload.successReload,
            controllers.etu.login,
            auth.addAuth,
            controllers.reload.redirectToSuccess
        );

    ////////////////
    // CSP Report //
    ////////////////

    servicesRouter.route('/report')
        .post(
            auth.noAuth,
            controllers.report.report
        );

    /* Params filters */
    var justIds = ['eventId', 'priceId', 'domainId', 'accountId', 'userId', 'ticketId', 'id', 'amount'];
    justIds.forEach(function (idName) {
        router.param(idName, function (req, res, next, id) {
             if (Number.isPositiveNumeric(id)) {
                req.body[idName] = id;
                next();
            } else {
                Error.emit(res, 400, '400 - Bad Request', 'Bad id');
            }
        });
    });

    router.param('token', function (req, res, next, token) {
        var reg = /^.+$/;
        if (reg.test(token)) {
            req.params.token = token;
            next();
        } else {
            Error.emit(res, 400, '400 - Bad Request', 'Bad token');
        }
    });

    router.param('mail', function (req, res, next, mail) {
        if (validator.isEmail(mail)) {
            req.params.mail = mail;
            next();
        } else {
            Error.emit(res, 400, '400 - Bad Request', 'Bad mail');
        }
    });

    router.param('name', function (req, res, next, name) {
        var reg = /^.+$/;
        if (reg.test(name)) {
            req.params.name = name;
            next();
        } else {
            Error.emit(res, 400, '400 - Bad Request', 'Bad name');
        }
    });
};
