// Pay - /app/public/adminEvent/adminEvent.js

// Controller for event dashboard

'use strict';

pay.controller('AdminEvent', [
    '$scope',
    '$timeout',
    '$routeParams',
    'SiteEtu',
    'Event',
    'EventTickets',
    'Error',
    function ($scope, $timeout, $routeParams, SiteEtu, Event, EventTickets, Error) {
        if (!SiteEtu.etu) {
            /*Error('Erreur', 5, true);
            setTimeout(function () {
                location.hash = '#/';
                $('#modalError').modal('hide');
            }, 5000);
            return;*/
        }

        var eventId = $routeParams.eventId;

        // Activate the datepicker, and ng-validate when the date changes
        $('.date').datetimepicker().on('dp.change', function () {
            var $self = $(this).children().first();
            $timeout(function () {
                $self.data().$ngModelController.$setViewValue($self.val());
            }, 0);
        });

        /**
          * Checks whether the given string is an positive integer or not
          * @param {string} str - The integer as a strign
          * @return {bool} True if the given string is an integer
          */
        function isInteger (str) {
            var n = ~~Number(str);
            return String(n) === str && n >= 0;
        }

        if (!isInteger(eventId)) {
            Error('Erreur', 6, true);
            setTimeout(function () {
                location.hash = '#/';
                $('#modalError').modal('hide');
            }, 3000);
            return;
        }

        Event.get({
            id: eventId,
        }, function (event) {
            $scope.event = event;
            $scope.event.date = moment($scope.event.date).format('DD/MM/YYYY HH:mm');
            $('.date').data('DateTimePicker').setDate($scope.event.date.split(' ')[0]);
            $scope.remainingTime = moment(new Date(event.date) - new Date()).format('D [jour(s) et] H [heure(s)]');
        });

        EventTickets.query({
            id: eventId
        }, function (tickets) {
            $scope.tickets = tickets;

            // Tickets with etu price
            $scope.ticketsEtu = tickets.filter(function (ticket) {
                return ticket.student && !ticket.contributor
            });

            // Tickets with bde member price
            $scope.ticketsContrib = tickets.filter(function (ticket) {
                return ticket.student && ticket.contributor
            });

            // Tickets with external price
            $scope.ticketsExt = tickets.filter(function (ticket) {
                return !ticket.student && !ticket.contributor
            });

            // Tickets not paid, in cash
            $scope.ticketsNotPaid = tickets.filter(function (ticket) {
                return !ticket.paid
            });

            // Amount of paid tickets
            $scope.paidTickets = tickets.length - $scope.ticketsNotPaid.length;
        });

        /**
          * Edits the event parameters
          * @param {object} e - The click event 
          */
        this.editParameters = function (e) {
            e.preventDefault();
            $('#modalEdit').modal();
        };
    }
]);