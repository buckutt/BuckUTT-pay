// Pay - /app/ticketsList/directives.js

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

                // Cannot pass elem to the notifier (bind, ...)
                scope.lastElem = $self;
                scope.$eval($(this).attr('pay-onresize-notifier'));
                delete scope.lastElem;
            });
        }, true);

        $window.on('resize', function () {
            scope.$apply();
        });
    }
}]);
