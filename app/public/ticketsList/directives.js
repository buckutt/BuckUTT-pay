// Pay - /app/public/ticketsList/directives.js

// Directives for tickets list

'use strict';

pay.directive('payOnresize', ['$window', function ($win) {
    return function (scope, element, attr) {
        var $window = $($win);

        // Watches for window height/width change
        scope.$watch(function () {
            return $window.width();
        }, function (newValue, oldValue) {
            $('[pay-onresize-notifier]').each(function () {
                var $self = $(this);

                // Cannot pass arguments to $eval, neither to scope
                $.data(document.body, '$lastElem', $self);
                scope.$eval($self.attr('pay-onresize-notifier'));
                $.removeData(document.body);
            });
        }, true);

        $window.on('resize', function () {
            scope.$apply();
        });
    }
}]);
