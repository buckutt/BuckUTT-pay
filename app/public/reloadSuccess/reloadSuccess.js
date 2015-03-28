////////////////////
// Auto auth user //
////////////////////

'use strict';

pay.controller('ReloadSuccess', [
    '$routeParams',
    function ($routeParams) {
        if ($routeParams.userdata) {
            sessionStorage.setItem('auto-auth', $routeParams.userdata);
            location.hash = '#/reloadSuccess';
        }
    }
]);