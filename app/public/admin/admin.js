////////////////////////////////
// Controller for admin panel //
////////////////////////////////

'use strict';

pay.controller('Admin', [
    '$scope',
    '$http',
    '$timeout',
    'PayAuth',
    'Event',
    'FormValidator',
    'Error',
    function ($scope, $http, $timeout, PayAuth, Event, FormValidator, Error) {
        if (!PayAuth.needUser()) { return; }

        $scope.isAdmin = PayAuth.etu.isAdmin === true;
        $scope.fundation = PayAuth.etu.fundation;

        /**
         * Show events list
         */
        function getEventsListsWithAccounts (callback) {
            Event.query(function (events) {
                var keptEvents = [];
                var keptEventsSeller = [];
                var keptEventsSellerWithEventCard = [];
                // Prevent duplicates in keptEventsSellerWithEventCard
                var addedEventsSellerWithEventCardIds = [];
                // Prevent duplicates in keptEvents
                var addedEvents = [];
                // Prevent duplicates in keptEventsSeller
                var addedEventsSeller = [];

                $http.get('/api/accounts/' + PayAuth.etu.id).then(function (accountsRes) {
                    accountsRes.data.forEach(function (account) {
                        events.forEach(function (event) {
                            if (event.id === account.event) {
                                if (PayAuth.etu.isAdmin) {
                                    if (addedEvents.indexOf(event.id) === -1) {
                                        keptEvents.push(event);
                                        addedEvents.push(event.id);
                                    }
                                    if (addedEventsSeller.indexOf(event.id) === -1) {
                                        keptEventsSeller.push(event);
                                        addedEventsSeller.push(event.id);
                                    }
                                } else if (account.admin) {
                                    if (addedEvents.indexOf(event.id) === -1) {
                                        keptEvents.push(event);
                                        addedEvents.push(event.id);
                                    }
                                } else {
                                    if (addedEventsSeller.indexOf(event.id) === -1) {
                                        keptEventsSeller.push(event);
                                        addedEventsSeller.push(event.id);
                                    }

                                    if (event.bdeCard) {
                                        if (addedEventsSellerWithEventCardIds.indexOf(event.id) === -1) {
                                            keptEventsSellerWithEventCard.push(event);
                                            addedEventsSellerWithEventCardIds.push(event.id);
                                        }
                                    }
                                }
                            }
                        });
                    });
                    if (typeof callback === 'function') { callback(); }
                }, function () {
                    if (typeof callback === 'function') { callback(); }
                    Error('Erreur', 0);
                });

                $scope.events = keptEvents;
                $scope.eventsSeller = keptEventsSeller;
                $scope.eventsSellerWithEventCard = keptEventsSellerWithEventCard;
            });
        }

        getEventsListsWithAccounts();

        // Model for the new event
        $scope.newEvent = {};
        $scope.fileInfo = null;
        $scope.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4} [0-2][0-9]?:[0-5]?[0-9]$/;

        /**
         * Called when the ng-if has been evaluted
         */
        this.activateDate = function () {
            // Activate the datepicker, and ng-validate when the date changes
            $('.date').datetimepicker().on('dp.change', function () {
                var $self = $(this).children().first();
                $timeout(function () {
                    $self.data().$ngModelController.$setViewValue($self.val());
                }, 0);
            });
        };

        /**
         * Called when the ng-if has been evaluated
         */
        this.activateFile = function () {
            // Updates the input text with the input file name
            $('input[type=file]').on('change', function () {
                if (this.files.length === 1) {
                    $(this).parent().parent().next().val(this.files[0].name);
                }
            });
        };

        /**
         * Creates a event
         * @param {object} e The click event
         */
        this.createEvent = function (e) {
            if (!FormValidator(newEventForm, 'file')) {
                return;
            }

            var $btn = $(e.currentTarget).attr('disabled', '');
            var file = newEventForm.file.files[0];

            // Image -> string
            var reader = new FileReader();
            reader.onload = function (e) {
                var result = e.currentTarget.result;
                // Duplicate event to preserve from changes made by the resource
                var newEventData = jQuery.extend(true, {}, $scope.newEvent);

                newEventData.image = result;
                newEventData.date = moment(newEventData.date, 'DD/MM/YYYY HH:mm').toDate();
                newEventData.fundationId = $scope.fundation.id;
                var newEvent = new Event(newEventData);
                newEvent.$save(function () {
                    getEventsListsWithAccounts(function () {
                        $scope.$emit('$locationChangeSuccess', '');
                        $btn.removeAttr('disabled');
                        $('html, body').animate({
                            scrollTop: 0
                        }, 'fast');
                    });
                }, function (res) {
                    $btn.removeAttr('disabled');
                    // Request entity too large => file size too large
                    if (res.status === 413) {
                        Error('Erreur', 16);
                    }
                    Error('Erreur', res.data.error);
                });
            };
            reader.readAsDataURL(file);
        };
    }
]);
