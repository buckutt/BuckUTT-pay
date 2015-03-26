////////////////////
// Auto auth user //
////////////////////

'use strict';

pay.controller('TicketBought', [
    '$routeParams',
    function ($routeParams) {
        if ($routeParams.userdata) {
            sessionStorage.setItem('auto-auth', $routeParams.userdata);
            location.hash = '#/ticketBought';
        }
    }
]);