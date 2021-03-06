////////////////////////////////////
// Controller for event dashboard //
////////////////////////////////////

'use strict';

pay.controller('AdminEvent', [
    '$scope',
    '$timeout',
    '$filter',
    '$routeParams',
    '$http',
    'ParsePrices',
    'PayAuth',
    'Event',
    'Account',
    'BankPrice',
    'EventTickets',
    'FormValidator',
    'Error',
    function ($scope, $timeout, $filter, $routeParams, $http, ParsePrices, PayAuth, Event, Account, BankPrice, EventTickets, FormValidator, Error) {
        if (!PayAuth.needUser()) { return; }

        var eventId = $routeParams.eventId;

        var BoundAccount = Account.bind({
            id: eventId
        });

        $scope.foundUsers = {};
        $scope.vendors = [];
        $scope.admins = [];

        // jQuery autocomplete
        $('#searchVendorUser, #searchAdminUser').autocomplete({
            serviceUrl: '/api/etu/search/',
            minChars: 3,
            maxHeight: 400,
            zIndex: 9999,
            // callback function:
            onSelect: function (suggestion) {
                if (this.id === 'searchVendorUser') {
                    $scope.vendorToAdd = suggestion.value;
                } else {
                    $scope.adminToAdd = suggestion.value;
                }
            },
            onSearchError: function (v, e) {
                if (e.responseText) {
                    Error('Erreur', JSON.parse(e.responseText).error);
                }
            },
            transformResult: function (response) {
                var fullNames = JSON.parse(response).map(function (v) {
                    $scope.foundUsers[v.fullName] = v.id;
                    return v.fullName;
                });
                return {
                    suggestions: fullNames
                };
            }
        });

        // Activate the datepicker, and ng-validate when the date changes
        $('.date').datetimepicker().on('dp.change', function () {
            var $self = $(this).children().first();
            $timeout(function () {
                if (!$self.data().$ngModelController) {
                    return;
                }
                $self.data().$ngModelController.$setViewValue($self.val());
            });
        });

        // Updates the input text with the input file name
        $('input[type=file]').on('change', function (e) {
            if (this.files.length === 1) {
                $(this).parent().parent().next().val(this.files[0].name);
            }
        });

        /**
         * Checks whether the given string is a positive integer or not
         * @param  {string}  str The integer as a string
         * @return {Boolean}     True if the given string is an integer
         */
        function isInteger (str) {
            var n = ~~Number(str);
            return String(n) === str && n >= 0;
        }

        if (!isInteger(eventId)) {
            location.hash = '#/admin/';
            Error('Erreur', 6);
            return;
        }

        Event.get({
            id: eventId,
        }, function (e) {
            if (!e.hasOwnProperty('id')) {
                location.hash = '#/admin/';
                Error('Erreur', 0);
            }
            $scope.currentEvent = e;

            // Parse the date
            var b = moment($scope.currentEvent.date, moment.ISO_8601);
            var now = moment();
            var diff = moment({
                years: b.year() - now.year(),
                months: b.month() - now.month(),
                date: b.date() - now.date(),
                hours: b.hours() - now.hours(),
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            });
            var formatted = diff.months() + ' mois, ' +
                            diff.date() + ' jours et ' +
                            diff.hours() + ' heure(s)';

            $scope.currentEvent.date = b.format('DD/MM/YYYY HH:mm');
            $('.date').data('DateTimePicker').date($scope.currentEvent.date);
            $scope.remainingTime = formatted;

            // Parse the prices
            ParsePrices.fromEvent(e);
        }, function (res) {
            location.hash = '#/admin/';

            if (res.data && res.data.status) {
                return Error('Erreur', res.data.error);
            }
            Error('Erreur', 6);
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

            // Tickets bought with card
            $scope.ticketsByCard = tickets.filter(function (ticket) {
                return ticket.paid_with === 'card';
            });
            // Tickets bought with cheque
            $scope.ticketsByCheque = tickets.filter(function (ticket) {
                return ticket.paid_with === 'cheque';
            });

            // Bank cost
            BankPrice.get(function (data) {
                var bankPrice = data.bankPrice;
                $scope.bdeCost = $scope.ticketsByCard.length * bankPrice / 100;
            });
        });

        Account.query({
            id: eventId
        }, function (accounts) {
            accounts.forEach(function (account) {
                var nameSplitted = account[0].split(' ');
                nameSplitted.push(account[1]);
                if (account[2] === 1) {
                    $scope.admins.push(nameSplitted);
                } else {
                    $scope.vendors.push(nameSplitted);
                }
            });
        });

        /**
         * Edits the event parameters
         * @param {object} e The click event
         */
        this.editParameters = function (e) {
            e.preventDefault();
            $('#modalEdit').modal();
        };

        /**
         * Edits the event
         * @param {object} e The click event
         */
        this.editEvent = function (e) {
            var $btn = $(e.currentTarget).attr('disabled', '');
            var fileDisabled = eventForm.file.files.length === 0;
            if (fileDisabled) {
                if (!FormValidator(eventForm)) {
                    return;
                }
            } else {
                if (!FormValidator(eventForm, 'input[type="file"]', true)) {
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
                    $btn.removeAttr('disabled');
                    $scope.currentEvent = this;
                    var dateDiff = new Date($scope.currentEvent.date) - new Date();
                    $scope.currentEvent.date = moment(new Date($scope.currentEvent.date)).format('DD/MM/YYYY HH:mm');
                    $('.date').data('DateTimePicker').date($scope.currentEvent.date);
                    $scope.remainingTime = moment(new Date(dateDiff)).format('D [jour(s) et] H [heure(s)]');
                    $('#modalEdit').modal('hide');
                }, function (res) {
                    $btn.removeAttr('disabled');
                    Error('Erreur', res.data.error);
                });
            }
        };

        /**
         * Shows the modal to prevent from miss clicks
         * @param {string} e The click event
         */
        this.confirmDeleteEvent = function (e) {
            e.preventDefault();
            $('#modalConfirm').modal();
        };

        /**
         * Deletes the event
         * @param {object} e The click event
         */
        this.deleteEvent = function (e) {
            var $btn = $(e.currentEvent).attr('disabled', '');
            e.preventDefault();
            $scope.currentEvent.$remove({
                id: $scope.currentEvent.id
            }).then(function (res) {
                $btn.removeAttr('disabled');
                if (res.status === 200) {
                    $('#modalConfirm').modal('hide').on('hidden.bs.modal', function () {
                        location.hash = '#/admin/';
                    });
                }
            });
        };

        /**
         * Shows the modal to changes the event prices
         * @param {object} e The click event
         */
        this.showChangePrices = function (e) {
            e.preventDefault();
            $('#modalPrices').modal();
        };

        /**
         * Changes the event prices
         * @param {object} e The click event
         */
        this.changePrices = function (e) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');
            ParsePrices.toEvent($scope.currentEvent, $scope.newPrices, function () {
                $('#modalPrices').modal('hide');
                $btn.removeAttr('disabled');

                $scope.$emit('$locationChangeSuccess', '');
            });
        };

        /**
         * Adds a vendor to the event
         * @param {object} e The submit event
         */
        this.addVendor = function (e) {
            e.preventDefault();
            var username = $scope.foundUsers[$scope.vendorToAdd];
            var displayName = $scope.vendorToAdd;

            var newAccount = new BoundAccount({
                username: username,
                displayName: displayName,
                event_id: $scope.currentEvent.id,
                right_id: 2 // Vendor right
            });

            newAccount.$save(function () {
                var splitted = displayName.split(' ');
                var firstName = splitted.shift();
                var lastName = splitted.join(' ');

                $scope.vendorToAdd = '';
                $scope.vendors.push([firstName, lastName, newAccount.id]);
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Adds an admin to the event
         * @param {object} e The submit event
         */
        this.addAdmin = function (e) {
            e.preventDefault();
            var username = $scope.foundUsers[$scope.adminToAdd];
            var displayName = $scope.adminToAdd;
            var newAccount = new BoundAccount({
                username: username,
                displayName: displayName,
                event_id: $scope.currentEvent.id,
                right_id: 1 // Admin right
            });

            newAccount.$save(function () {
                var splitted = displayName.split(' ');
                var firstName = splitted.shift();
                var lastName = splitted.join(' ');

                $scope.adminToAdd = '';
                $scope.admins.push([firstName, lastName, newAccount.id]);
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Removes an account (admin or vendor)
         * @param  {object} e         The submit event
         * @param  {number} accountId The account id
         */
        this.removeAccount = function (e, accountId) {
            e.preventDefault();
            $http.delete('/api/accounts/' + accountId).then(function () {
                if (e.currentTarget.dataset.hasOwnProperty('vendor')) {
                    $scope.vendors.splice(e.currentTarget.dataset.index, 1);
                } else {
                    $scope.admins.splice(e.currentTarget.dataset.index, 1);
                }
            }, function () {
                Error('Erreur', 0);
            });
        };
    }
]);
