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
        $scope.code = '';
        $scope.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        $scope.codePattern = /^[A-Z0-9]{5}$/;

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
            var $self = $(e.currentTarget);
            var $selfRow = $self.parent().parent();
            var $selfCol = $self.parent().parent().parent().parent().parent();
            var $target = $selfRow.siblings('.row.paywith.' + meanOfPayment);

            if (!$target.hasClass('active')) {
                var newHeight = $selfRow.height() + $target.height();
                $selfCol.addClass('expended').height(newHeight);

                var $othersTargets = $target.siblings('.paywith').removeClass('active');
                $target
                    .insertBefore($othersTargets.first())
                    .addClass('active');
            } else {
                $selfCol.removeClass('expended').removeAttr('style');
                $target.removeClass('active');
            }
        };

        /**
         * Buys one ticket with buckutt
         * @param {object} e         The click event
         * @param {number} eid       The event id
         * @param {string} birthdate The user birthdate
         */
        this.buyOneWithBuckutt = function (e, eid, birthdate) {
            if (!birthdate || !$scope.datePattern.test(birthdate)) {
                $(e.currentTarget).parent().parent().parent().children('div.input-group').addClass('has-error');
                return;
            }

            $btn.attr('disabled', '');

            $http.post('api/buy/buckutt/' + eid, {
                birthdate: birthdate
            }).then(function () {
                var $btn = $(e.currentTarget);
                $btn.text('Achat effectué !');
                var $cross = $btn.parent().parent().parent().parent().parent().find('.cross > i');
                $timeout(function () {
                    PayAuth.etu.credit -= parseFloat($scope.prices[eid]) * 100;
                    PayAuth.etu.tickets.push(eid);
                    $rootScope.$emit('payauth:logged', true);
                });
                setTimeout(function () {
                    self.hideBuyingCards({
                        currentTarget: $cross[0]
                    });
                }, 2500);
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
         * @param {string} mail The mail to test
         */
        this.sendCheckMail = function (e, eid, mail) {
            var $btn = $(e.currentTarget).attr('disabled', '');

            if (!FormValidator($btn.parents('form'))) {
                $btn.removeAttr('disabled');
                return;
            }
            
            $http.post('api/sendCheckMail/' + eid + '/' + mail).then(function () {
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
         * @param {string} mail        The mail to register
         * @param {string} displayName The displayName to register
         * @param {string} birthdate   The birthdate to register
         * @param {string} code        The token to valiate
         */
        this.buyOneWithCardExt = function (e, eid, mail, displayName, birthdate, code) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.post('api/buy/card/ext/' + eid, {
                mail: mail,
                displayName: displayName,
                birthdate: birthdate,
                code: code
            }).then(function () {
                $btn.removeAttr('disabled');
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Buys one ticket with card
         * @param {object} e         The click event
         * @param {number} eid       The event id
         * @param {string} birthdate The birthdate to register
         */
        this.buyOneWithCard = function (e, eid, birthdate) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.post('api/buy/card/' + eid, {
                birthdate: birthdate
            }).then(function () {
                $btn.removeAttr('disabled');
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });

        };
}]);
