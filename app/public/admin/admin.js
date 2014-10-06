// Pay - /app/public/admin/admin.js

// Controller for admin panel

'use strict';

pay.controller('Admin', [
    'SiteEtu',
    function (SiteEtu) {
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

        this.expendPanel = function (e) {
            var $self = $(e.currentTarget);
            $self.next().slideToggle();
        };
    }
]);
