//////////////////////////////////////
// Event card assignator controller //
//////////////////////////////////////

'use strict';

pay.controller('AssignateCard', [
  '$scope',
  '$http',
  '$routeParams',
  'Ticket',
  'PayAuth',
  function ($scope, $http, $routeParams, Ticket, PayAuth) {
        if (!PayAuth.needUser()) { return; }

        // Autofocus
        $('#etuPanel input').focus();

        /**
         * Blurs the first input, gives focus to the next one
         * @param {object} e The click event
         */
        this.next = function (e) {
            e.preventDefault();
            $('#eventCardPanel input').focus();
        };

        this.assignate = function (e) {
            e.preventDefault();
            $http.post('api/assignateCard/' + $routeParams.event, {
                etu_id: $scope.id,
                bdeCard: $scope.eventCard
            }).then(function (res) {
                $('#success').fadeIn('fast').delay(1000).fadeOut('fast');
                $scope.id = '';
                $scope.eventCard = '';
                $('#etuPanel input').focus();
            }, function (res) {
                $('#error').fadeIn('fast').delay(1000).fadeOut('fast');
            });
        };
  }
]);