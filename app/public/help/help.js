/////////////////////
// Help controller //
/////////////////////

'use strict';

pay.controller('Help', [
    '$location',
    '$anchorScroll',
    function ($location, $anchorScroll) {
        this.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };
    }
]);