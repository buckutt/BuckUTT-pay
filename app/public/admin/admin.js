// Pay - /app/public/admin/admin.js

// Controller for admin panel

'use strict';

pay.controller('Admin', [
    'SiteEtu',
    'Event',
    function (SiteEtu, Event) {
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
        $('.date').datetimepicker();

        $('input[type=file]').on('change', function (e) {
            if (this.files.length === 1) {
                $(this).parent().parent().next().val(this.files[0].name);                
            }
        });

        /**
          * Expends the create event or the manage events panel
          * @param {object} e - The click event
          */
        this.expendPanel = function (e) {
            var $self = $(e.currentTarget);
            $self.next().slideToggle();
        };

        /**
          * Creates a event
          */
        this.createEvent = function () {
            var $name = $('#name');
            var $date = $('#date');
            var $description = $('#description');
            var $file = $('#file');
            var file = $file[0].files[0];

            // Input validation

            // Image -> string
            var reader = new FileReader();
            reader.onload = function (e) {
                var result = e.currentTarget.result;
                console.log(result.length);

                var newEvent = new Event({
                    name: $name.val(),
                    description: $description.val(),
                    date: moment($date.val(), 'DD-MM-YYYY HH:mm'),
                    image: result
                });

                newEvent.$save();
            };
            reader.readAsDataURL(file);
        };
    }
]);
