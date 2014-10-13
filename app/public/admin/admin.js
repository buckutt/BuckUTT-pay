// Pay - /app/public/admin/admin.js

// Controller for admin panel

'use strict';

pay.controller('Admin', [
    '$scope',
    'SiteEtu',
    'Event',
    'Error',
    function ($scope, SiteEtu, Event, Error) {
        // Shows events list
        Event.query(function (events) {
            $scope.events = events;
        });

        // Model for the new event
        $scope.newEvent = {};
        $scope.datePattern = /^\d{1,2}\/\d{1,2}\/\d{4} [0-2][1-9]?:[0-5]?[0-9]$/;

        if (!SiteEtu.etu) {
            /*Error('Erreur', 5, true);
            setTimeout(function () {
                location.hash = '#/';
                $('#modalError').modal('hide');
            }, 3000);
            return;*/
        }

        // Datepickers
        $.extend($.fn.datetimepicker.defaults, {
            pickDate: true,
            pickTime: true,
            useMinutes: true,
            useSeconds: false,
            useCurrent: true,
            minuteStepping: 15,
            minDate: new Date(),
            showToday: true,
            language: 'fr',
            useStrict: true,  
            sideBySide: true,
            daysOfWeekDisabled: [0, 7]
        });

        // Activate the datepicker, and ng-validate when the date changes
        $('.date').datetimepicker().on('dp.change', function () {
            console.log('update');
            var $self = $(this).children().first();
            console.log($self);
            $self.data().$ngModelController.$setViewValue($self.val());
            $self.scope().$apply();
        });

        $('input[type=file]').on('change', function (e) {
            if (this.files.length === 1) {
                $(this).parent().parent().next().val(this.files[0].name);                
            }
        });

        /**
          * Creates a event
          */
        this.createEvent = function () {
            // If we end directly the function, all errors may be not thrown
            var continueSend = true;

            // Input validation
            var isFormValid = $('.ng-pristine, .ng-invalid', newEventForm).length === 0;
            if (!isFormValid) {
                var $invalids = $('.ng-pristine, .ng-invalid', newEventForm);
                $invalids.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                continueSend = false;
            }

            // Image validation
            var $file = newEventForm.file;
            var file = $file.files[0];
            if (!file || (file.type !== 'image/png' && file.type !== 'image/jpeg')) {
                $($file).parent().parent().next().addClass('ng-invalid');
                continueSend = false;
            }

            if (!continueSend) {
                //return;
            }

            // Image -> string
            var reader = new FileReader();
            reader.onload = function (e) {
                var result = e.currentTarget.result;
                $scope.newEvent.image = result;
                var newEvent = new Event($scope.newEvent);
                newEvent.$save();
            };
            reader.readAsDataURL(file);
        };
    }
]);
