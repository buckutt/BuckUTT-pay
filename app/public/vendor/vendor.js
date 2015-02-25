///////////////////////////////
// Tickets seller controller //
///////////////////////////////

'use strict';

pay.controller('Vendor', [
  '$scope',
  '$http',
  '$routeParams',
  '$location',
  'PayAuth',
  function ($scope, $http, $routeParams, $location, PayAuth) {
        if (!PayAuth.needUser()) { return; }

        $('#autoPanel input').focus();

        var $success = $('#success');
        var $error   = $('#error');

        /**
         * Validates a ticket with id
         * @param  {object} e The click event
         */
        this.validateById = function (e) {
            e.preventDefault();
            $http.post('api/vendor/' + $routeParams.event + '/' + $scope.id).then(function () {
                $success.fadeIn('fast').delay(1000).fadeOut('fast');
            }, function (res) {
                var text = '';
                if (res.status === 401) {
                  text = 'Ticket introuvable';
                } else if (res.status === 402) {
                  text = 'Ticket non payé';
                } else if (res.status === 409) {
                  text = 'Déjà validé';
                }

                $error.fadeIn('fast', function () {
                  $(this).text(text);
                }).delay(1000).fadeOut('fast', function () {
                  $(this).text('');
                });
            });
            $scope.id = '';
        };

        window.onbeforeunload = function (e) {
            var e = e || window.event;
            if (e) {
                e.returnValue = 'Recharger la page entraîne la déconnexion.';
            }
            return 'Recharger la page entraîne la déconnexion.';
        };
  }
]);
