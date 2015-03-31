////////////////////
// Auto auth user //
////////////////////

'use strict';

pay.controller('TicketBought', [
    '$scope',
    '$routeParams',
    '$location',
    function ($scope, $routeParams, $location) {
        if ($routeParams.userdata) {
            sessionStorage.setItem('auto-auth', $routeParams.userdata);
            location.href = '#/ticketBought?ticektId=' + $location.search().ticketId;
        } else {
            $scope.ticketId = $location.search().ticketId;
            $scope.sherlocksToken = $location.search().sherlocksToken;
        }
    }
]);