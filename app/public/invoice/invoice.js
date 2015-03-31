////////////////////////
// Invoice controller //
////////////////////////

'use strict';

pay.controller('Invoice', [
    '$scope',
    '$routeParams',
    '$http',
    'PayAuth',
    function ($scope, $routeParams, $http, PayAuth) {
        if (!PayAuth.needUser()) { return; }

        $scope.date = new Date();

        $http.get('api/ticket/' + $routeParams.id).then(function (res) {
            $scope.ticket = res.data;
        });
    }
]);