// Pay - /app/public/ticketsList/debounce.js

// Debounces for tickets list

'use strict';

pay.factory('$debounce', ['$timeout', function ($timeout) {
    // Underscore debouncer
    var timeout;
    return function debounce (func, wait, immediate) {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        $timeout.cancel(timeout);
        timeout = $timeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}]);
