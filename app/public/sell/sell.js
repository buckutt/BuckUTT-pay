///////////////////////////////
// Tickets seller controller //
///////////////////////////////

'use strict';

pay.controller('Sell', [
  '$scope',
  '$http',
  '$routeParams',
  'PayAuth',
  'Event',
  'Ticket',
  function ($scope, $http, $routeParams, PayAuth, Event, Ticket) {
        if (!PayAuth.needUser()) { return; }

        $scope.ticket = {
            username: 0,
            paid: true,
            paid_at: new Date(),
            paid_with: 'liquid',
            temporarlyOut: false,
            barcode: 0,
            event_id: $routeParams.event
        };

        var $success = $('#success');
        var $error   = $('#error');

        /**
         * Switch vendor/validate
         */
        this.switchPage = function () {
            location.hash = '/validate/' + $routeParams.event;
        };

        Event.get({
            id: $routeParams.event,
        }, function (e) {
            // Sets event on scope
            $scope.event = e;

            // Gets event's prices
            $http.get('api/events/' + $routeParams.event + '/prices').then(function (res) {
                var eventPrices = res.data;

                // Reduces the name
                eventPrices = eventPrices.map(function (price) {
                    price.name = price.name.replace($scope.event.name + ' - ', '');
                    return price;
                }).filter(function (price) {
                    return price.name.indexOf('en prévente') === -1;
                });

                // Exposes
                $scope.eventPrices = eventPrices;

                // Sets default price
                $scope.price = eventPrices[0];
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        }, function (res) {
            Error('Erreur', res.data.error);
        });

        // Watches price to get price id (ngmodel in select)
        $scope.$watch('price', function (price) {
            if (price && price.id) {
                $scope.ticket.price_id = price.id;

                if ($scope.price.name.indexOf('Prix étudiant cotisant hors prévente') === 0) {
                    $scope.ticket.contributor = true;
                    $scope.ticket.student = true;
                } else if ($scope.price.name.indexOf('Prix étudiant non-cotisant hors prévente') === 0) {
                    $scope.ticket.contributor = false;
                    $scope.ticket.student = true;
                } else if ($scope.price.name.indexOf('Prix partenaire hors prévente') === 0) {
                    $scope.ticket.contributor = false;
                    $scope.ticket.student = true;
                }
            }
        });

        /**
         * Sets the ticket "paid_with" property
         * @param {string} meanOfPayment Mean of payment used by the buyer
         */
        this.setPaidWith = function (meanOfPayment) {
            $scope.ticket.paid_with = meanOfPayment;
        };

        /**
         * Submits the newly created ticket
         */
        this.submitTicket = function () {
            var newTicket = new Ticket($scope.ticket);
            newTicket.$save(function () {
                $success.fadeIn('fast').delay(1000).fadeOut('fast');
            }, function (res) {
                $error.fadeIn('fast').delay(1000).fadeOut('fast');
            });
        };
  }
]);