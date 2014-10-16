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
    'FormValidator',
    'Error',
    function ($scope, $timeout, $routeParams, SiteEtu, Event, EventTickets, FormValidator, Error) {
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

        // Updates the input text with the input file name
        $('input[type=file]').on('change', function (e) {
            if (this.files.length === 1) {
                $(this).parent().parent().next().val(this.files[0].name);                
            }
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
            $('#modalError').on('hidden.bs.modal', function () {
                location.hash = '#/admin/';
            });
            setTimeout(function () {
                $('#modalError').modal('hide');
            }, 3000);
            return;
        }

        Event.get({
            id: eventId,
        }, function (event) {
            if (!event.hasOwnProperty('id')) {
                Error('Erreur', 9, true);
                $('#modalError').on('hidden.bs.modal', function () {
                    location.hash = '#/admin/';
                });
                setTimeout(function () {
                    $('#modalError').modal('hide');
                }, 3000);
            }
            $scope.currentEvent = event;
            var dateDiff = new Date($scope.currentEvent.date) - new Date();
            $scope.currentEvent.date = moment(new Date($scope.currentEvent.date)).format('DD/MM/YYYY HH:mm');
            $('.date').data('DateTimePicker').setDate($scope.currentEvent.date);
            $scope.remainingTime = moment(new Date(dateDiff)).format('D [jour(s) et] H [heure(s)]');
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

        /**
          * Edits the event
          * @param {object} e - The click event 
          */
        this.editEvent = function (e) {
            var fileDisabled = eventForm.file.files.length === 0;
            if (fileDisabled) {
                if (!FormValidator(eventForm, 'file')) {
                    return;
                }
            } else {
                if (!FormValidator(eventForm, 'file', true)) {
                    return;
                }
            }

            if (!fileDisabled) {
                var file = eventForm.file.files[0];

                // Image -> string
                var reader = new FileReader();
                reader.onload = callback;
                reader.readAsDataURL(file);
            } else {
                callback();
            }

            function callback (e) {
                if (!fileDisabled) {
                    var result = e.currentTarget.result;
                    $scope.currentEvent.image = result;
                }

                $scope.currentEvent.date = moment($scope.currentEvent.date, 'DD/MM/YYYY HH:mm').toDate();

                $scope.currentEvent.$save(function (res) {
                    $scope.currentEvent = this;
                    var dateDiff = new Date($scope.currentEvent.date) - new Date();
                    $scope.currentEvent.date = moment(new Date($scope.currentEvent.date)).format('DD/MM/YYYY HH:mm');
                    $('.date').data('DateTimePicker').setDate($scope.currentEvent.date);
                    $scope.remainingTime = moment(new Date(dateDiff)).format('D [jour(s) et] H [heure(s)]');
                    $('#modalEdit').modal('hide');
                }, function (res) {
                    Error('Erreur', res.data.error);
                });
            }
        };

        /**
          * Shows the modal to prevent from miss clicks
          * @param {string} e - The click event
          */
        this.confirmDeleteEvent = function (e) {
            e.preventDefault();
            $('#modalConfirm').modal();
        };

        /**
          * Deletes the event
          * @param {string} e - The click event
          */
        this.deleteEvent = function (e) {
            e.preventDefault();
            $scope.currentEvent.$remove({
                id: $scope.currentEvent.id
            }).then(function (res) {
                if (res.status === 200) {
                    $('#modalConfirm').modal('hide').on('hidden.bs.modal', function () {
                        location.hash = '#/admin/';
                    });
                }
            });
        };
    }
]);