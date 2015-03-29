/////////////////////////////////////////
// Create a ticket directly from input //
/////////////////////////////////////////

'use strict';

pay.controller('CreateTicket', [
    '$scope',
    '$http',
    '$routeParams',
    'Ticket',
    'PayAuth',
    'Error',
    function ($scope, $http, $routeParams, Ticket, PayAuth, Error) {
        if (!PayAuth.needUser()) { return; }

        $scope.ticket = {
            paid: true,
            paid_at: new Date(),
            paid_with: 'buckutt',
            temporarlyOut: false,
            event_id: $routeParams.event
        };

        this.createTicket = function (e) {
            e.preventDefault();
            var $btn = $(e.currentTarget).attr('disabled', '');

            $http.get('api/getUsername/' + $scope.ticket.username).then(function (res) {
                $scope.ticket.username = res.data.username;
                $http.post('api/makeTicketFromAdmin', $scope.ticket).then(function () {
                    $btn.removeAttr('disabled');
                }, function () {
                    $btn.removeAttr('disabled');
                });
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        $scope.$watch(function () {
            return $scope.ticket.contributor
        }, function (v) {
            if (v) {
                $scope.ticket.student = true;
            }
        });

        $scope.$watch(function () {
            return $scope.ticket.student
        }, function (v) {
            if (!v) {
                $scope.ticket.contributor = false;
            }
        });
    }
]);