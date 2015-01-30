/////////////
// Routing //
/////////////

'use strict';

var validators = require('./controllers/validators');

module.exports = function (router, db, config) {
    var controllers = require('./controllers')(db, config);
    var auth       = require('./lib/auth')(config);

    // Tickets
    router.get(
        '/tickets',
        controllers.tickets.getAll
    );

    // Events
    router.route('/events').
        get(
            controllers.events.getAll
        )
        .post(
            validators.createEvent,
            controllers.events.create
        )
        .put(
            validators.editEvent,
            controllers.events.edit
        );

    router.route('/events/:eventId')
        .delete(
            controllers.events.remove
        )
        .get(
            controllers.events.getOne
        );

    // Events ticket
    router.get(
        '/events/:eventId/tickets',
        controllers.tickets.getAllFromEvent
    );

    // Events prices
    router.put(
        '/events/:eventId/prices',
        validators.createPrice,
        controllers.events.createPrice
    );
    router.post(
        '/events/:eventId/prices/:priceId',
        validators.editPrice,
        controllers.events.editPrice
    );

    // Auth etu
    router.post(
        '/etu/auth',
        validators.etuAuth,
        controllers.etu.auth,
        auth.addAuth
    );

    // Search among users list
    router.get(
        '/etu/search/',
        controllers.etu.searchUsers
    );

    // Token demo
    router.get(
        '/token/:token',
        auth.checkAuth,
        function (req, res) {
            res.json(req.user);
        }
    );

    // School domains
    router.route('/domains/')
        .get(
            controllers.domains.getAll
        )
        .post(
            validators.createDomain,
            controllers.domains.create
        );
    router.route('/domains/:domainId')
        .delete(
            controllers.domains.remove
        );

    // Back Price
    router.route('/bankPrice/')
        .get(
            controllers.bankPrice.get
        )
        .post(
            validators.editBankprice,
            controllers.bankPrice.edit
        );

    // Event accounts
    router.route('/events/:eventId/accounts')
        .post(
            validators.createAccount,
            controllers.accounts.create
        )
        .get(
            controllers.accounts.getAll
        );
    router.delete(
        '/accounts/:accountId',
        controllers.accounts.remove
    );
    router.get(
        '/accounts/:userId',
        controllers.accounts.getAllFromUserId
    );

    // Ticket printer
    router.get(
        '/print/',
        controllers.tickets.print
    );

    // Buckutt History
    router.get(
        '/purchases/',
        controllers.buckuttHistory.getPurchasesHistory
    );
    router.get(
        '/reloads/',
        controllers.buckuttHistory.getReloadsHistory
    );

    /* Params filters */
    var justIds = ['eventId', 'priceId', 'domainId', 'accountId', 'userId'];
    justIds.forEach(function (idName) {
        router.param(idName, function (req, res, next, id) {
            if (Number.isPositiveNumeric(id)) {
                req.body[idName] = id;
                next();
            } else {
                Error.emit(res, 400, '400 - Bad Request');
            }
        });
    });

    router.param('token', function (req, res, next, token) {
        var reg = /^([\w-]+\.){2}([\w-]+)$/;
        console.log(token);
        if (reg.test(token)) {
            req.params.token = token;
            next();
        } else {
            Error.emit(res, 400, '400 - Bad Request');
        }
    });
};
