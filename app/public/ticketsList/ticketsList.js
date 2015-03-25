/////////////////////////////////
// Controller for tickets list //
/////////////////////////////////

'use strict';

pay.controller('TicketsList', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$http',
    'Event',
    'FormValidator',
    'Error',
    'PayAuth',
    function ($scope, $rootScope, $timeout, $http, Event, FormValidator, Error, PayAuth) {
        var self = this;
        $scope.isAuth = !!PayAuth.etu;
        $scope.sold = ($scope.isAuth) ? PayAuth.etu.credit / 100 : 0;
        $scope.prices = {};
        $scope.extPrices = {};
        $scope.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        $scope.codePattern = /^[A-Z0-9]{5}$/;
        $scope.additionalExtTickets = [];
        $scope.buyingTickets = {};

        // Shows events list
        Event.query(function (events) {
            $scope.events = events;
            $rootScope.$on('payauth:logged', function (e, doNotHideCards) {
                if (!doNotHideCards) {
                    // Hides current opened panels
                    $timeout(function () {
                        $('.active i.fa-times').click();
                    });
                }

                $scope.isAuth = true;
                $scope.sold = PayAuth.etu.credit / 100;
                $scope.defaultMail = PayAuth.etu.mail;
                $('input[type="email"]').blur();
                $scope.jwt = PayAuth.etu.jwt;

                var eventsIds = $scope.events.map(function (e) { return e.id; });
                var ticketsEvIds = PayAuth.etu.tickets.map(function (t) { return t.event_id; });
                eventsIds.forEach(function (id) {
                    if (ticketsEvIds.indexOf(id) === -1) {
                        return;
                    } else {
                        $scope.events.forEach(function (e) {
                            if (e.id === id) {
                                e.isBought = true;
                                var ticket = PayAuth.etu.tickets[ticketsEvIds.indexOf(id)];
                                e.ticketBoughtId = ticket.id;
                            }
                        });
                    }
                });
            });

            if (PayAuth.etu) {
                $rootScope.$emit('payauth:logged');
            }
        });

        /**
         * Gets the price of the current event for the current user
         * @param {number} eventId The event id
         * @param {object} e       Optional, the blur event
         */
        this.getPrice = function (eventId, e) {
            var mail = (e) ? e.currentTarget.value : '';
            var $soldAfter = $('#soldAfter');
            $http.get('api/price/' + eventId + '?mail=' + mail).then(function (res) {
                $scope.prices[eventId] = res.data;
            }, function () {
                $scope.prices[eventId] = false;
            });
        };

        /**
         * Gets the price of the current event for an external user
         * @param {number} eventId The event id
         */
        this.getExtPrice = function (eventId) {
            var $soldAfter = $('#soldAfter');
            $http.get('api/priceExt/' + eventId).then(function (res) {
                $scope.extPrices[eventId] = res.data;
            }, function () {
                $scope.extPrices[eventId] = 0;
            });
        };

        /**
         * Checks if the prices variables contains key
         * @param  {string}  key The price
         * @return {Boolean}     Contains or not
         */
        this.hasPrice = function (key) {
            return $scope.prices.hasOwnProperty(key);
        };

        /**
         * Shows the three means of payment for the event
         * @param {object} e The click event 
         */
        this.showBuyingCards = function (e) {
            // Hide others buying tiles
            $('i.fa.fa-times').each(function () {
                var $self = $(this);
                if ($self.parent().parent().hasClass('active')) {
                    // Trigger break active cycle. Pass the trigger to the next cycle
                    $timeout(function () {
                        $self.trigger('click');
                    });
                }
            });

            $(e.currentTarget)
                .parent()
                    .removeClass('flipInX active')
                    .addClass('animated flipOutX')
                .next()
                    .removeClass('flipOutX')
                    .addClass('animated flipInX active');
        };

        /**
         * Hides the three means of payment for the event
         * @param {object} e The click event 
         */
        this.hideBuyingCards = function (e) {
            $(e.currentTarget)
                .parent().parent()
                    .removeClass('flipInX active')
                    .addClass('animated flipOutX')
                .prev()
                    .removeClass('flipOutX')
                    .addClass('animated flipInX active');

            $('.expended .active').removeClass('active');
            $('.expended').removeClass('expended').removeAttr('style');
        };

        /**
         * Shows the form for the mean of payment
         * @param {object} e             The click event 
         * @param {string} meanOfPayment The mean of payment (buckutt, card)
         */
        this.expendBuy = function (e, meanOfPayment) {
            $scope.additionalExtTickets = [];
            $timeout(function () {
                var $self = $(e.currentTarget);
                var $selfRow = $self.parent().parent();
                var $selfCol = $self.parent().parent().parent().parent().parent();
                var $target = $selfRow.siblings('.row.paywith.' + meanOfPayment);

                if (!$target.hasClass('active')) {
                    var $othersTargets = $target.siblings('.paywith').removeClass('active');
                    $target
                        .insertBefore($othersTargets.first())
                        .addClass('active');

                    var newHeight = $selfRow.height() + $target.height();
                    $selfCol.addClass('expended').height(newHeight).one('transitionend', function () {
                        var newHeight = $selfRow.height() + $target.height();
                        $selfCol.addClass('expended').height(newHeight)
                    });
                } else {
                    $selfCol.removeClass('expended').removeAttr('style');
                    $target.removeClass('active');
                }
            });
        };

        /**
         * Buys one ticket with buckutt
         * @param {object} e         The click event
         * @param {number} eid       The event id
         */
        this.buyOneWithBuckutt = function (e, eid) {
            if (!$scope.buyingTickets.birthdate || !$scope.datePattern.test($scope.buyingTickets.birthdate)) {
                $(e.currentTarget).parent().parent().parent().children('div.input-group').addClass('has-error');
                return;
            }

            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.post('api/buy/buckutt/' + eid, {
                birthdate: $scope.buyingTickets.birthdate,
                additionalExtTickets: $scope.additionalExtTickets
            }).then(function (res) {
                var $btn = $(e.currentTarget);
                $btn.text('Achat effectué !');
                var $cross = $btn.parent().parent().parent().parent().parent().find('.cross > i');
                $timeout(function () {
                    PayAuth.etu.credit -= parseFloat($scope.prices[eid]) * 100;
                    PayAuth.etu.credit -= $scope.additionalExtTickets.length * parseFloat($scope.extPrices[eid]) * 100;
                    PayAuth.etu.tickets.push({
                        event_id: eid,
                        id: res.data.id
                    });
                    $rootScope.$emit('payauth:logged', true);
                    setTimeout(function () {
                        self.hideBuyingCards({
                            currentTarget: $cross[0]
                        });
                    }, 400);
                });
                $btn.removeAttr('disabled');
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Sends a mail to the user to verify his mail
         * @param {object} e    The click event
         * @param {number} eid  The event id
         */
        this.sendCheckMail = function (e, eid) {
            var $btn = $(e.currentTarget).attr('disabled', '');

            if (!FormValidator($btn.parents('form'))) {
                $btn.removeAttr('disabled');
                return;
            }

            $http.post('api/sendCheckMail/' + eid + '/' + $scope.buyingTickets.mail).then(function () {
                $btn.removeAttr('disabled');
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', 0);
            });
        };

        /**
         * Buys one ticket with card
         * @param {object} e           The click event
         * @param {number} eid         The event id
         */
        this.buyOneWithCardExt = function (e, eid) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.post('api/buy/card/ext/' + eid, {
                mail: $scope.buyingTickets.mail,
                displayName: $scope.buyingTickets.displayName,
                birthdate: $scope.buyingTickets.birthdate,
                code: $scope.buyingTickets.code
            }).then(function (res) {
                $btn.removeAttr('disabled');
                $('#sherlocksPanel').addClass('active').show().find('.panel-body').children('div').html(res.data.form);
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Buys one ticket with card
         * @param {object} e         The click event
         * @param {number} eid       The event id
         */
        this.buyOneWithCard = function (e, eid) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.post('api/buy/card/' + eid, {
                birthdate: $scope.buyingTickets.birthdate,
                additionalExtTickets: $scope.additionalExtTickets
            }).then(function (res) {
                $btn.removeAttr('disabled');
                $('#sherlocksPanel').addClass('active').show().find('.panel-body').children('div').html(res.data.form);
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Checks code length
         * @param {object} e The keyup event
         */
        this.checkCode = function (e) {
            $scope.disableTakeTicket = false;
            var code = e.currentTarget.value;
            if (code.length === 5) {
                $scope.disableTakeTicket = true;
            }
        };
        this.checkCode({ currentTarget: { value: '' }});

        /**
         * Adds an external ticket
         * @param {object} e The click event
         */
        this.addExtTicket = function (e) {
            e.preventDefault();
            $scope.additionalExtTickets.push({
                displayName: '',
                birthdate: ''
            });
            $timeout(function () {
                var $target = $(e.currentTarget);
                $target.prev().children().last().css('height', '40px');
                var $prevParent = $target.prev().parents('.panel-col');
                $prevParent.height($prevParent.height() + 40);
            });
        };

        /**
         * Removes an external ticket
         * @param {object} e     The click event
         * @param {number} index The index
         */
        this.removeExtTicket = function (e, index) {
            e.preventDefault();
            var $self = $(e.currentTarget);
            var $prevParent = $self.prev().parents('.panel-col');
            $prevParent.height($prevParent.height() - 40);
            $self.parent().css('height', '0');
            // Do not use transitionend in case of the transition fails
            $timeout(function () {
                $scope.additionalExtTickets.splice(index, 1);
            }, 200);
        };

        /**
         * Makes parseFloat available in $eval
         * @param  {string} value A float string
         * @return {float}        The float value
         */
        this.parseFloat = function (value) {
            return parseFloat(value);
        };
}]);
