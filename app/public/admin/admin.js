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

        // Shows events list
        Event.query(function (events) {
            var keptEvents = [];
            var keptEventsSeller = [];
            $http.get('/api/accounts/' + PayAuth.etu.id).then(function (data) {
                data.data.forEach(function (account) {
                    events.forEach(function (event) {
                        if (event.id === account.event) {
                            if (PayAuth.etu.isAdmin) {
                                keptEvents.push(event);
                                keptEventsSeller.push(event);
                            } else if (account.admin) {
                                keptEvents.push(event);
                            } else {
                                keptEventsSeller.push(event);
                            }
                        }
                    });
                });
            }, function () {
                Error('Erreur', 0);
            });

            $scope.events = keptEvents;
            $scope.eventsSeller = keptEventsSeller;
        });

        // Model for the new event
        $scope.newEvent = {};
        $scope.fileInfo = null;
        $scope.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4} [0-2][0-9]?:[0-5]?[0-9]$/;

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
          * Creates a event
          */
        this.createEvent = function () {
            if (!FormValidator(newEventForm, 'file')) {
                return;
            }

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
                newEvent.$save(function (res) {
                    location.hash = '/admin/event/' + res.id
                }, function (res) {
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
