//////////////////////////////////
// Tickets validater controller //
//////////////////////////////////

'use strict';

pay.controller('Validate', [
  '$scope',
  '$http',
  '$timeout',
  '$routeParams',
  '$location',
  'PayAuth',
  'EventTickets',
  function ($scope, $http, $timeout, $routeParams, $location, PayAuth, EventTickets) {
        if (!PayAuth.needUser()) { return; }

        $('#autoPanel input').focus();

        var $success = $('#success');
        var $error   = $('#error');

        $scope.history = [];
        $scope.globalHistory = [];
        $scope.currentHistory = 'local';
        var countdown = 0;
        $scope.countdown = '(0)';

        /**
         * Validates a ticket with id
         * @param {object} e The click event
         */
        this.validateById = function (e) {
            e.preventDefault();
            $http.post('api/validate/' + $routeParams.event + '/' + $scope.id).then(function (res) {
                $success.fadeIn('fast').delay(1000).fadeOut('fast');
                $scope.history.unshift({
                    date: new Date(),
                    displayName: res.data,
                    method: 'Scanner',
                    status: true
                });
            }, errorPost('Scanner', $scope.id));
            $scope.id = '';
        };

        /**
         * Validates a ticket with name
         * @param {object} e The click event
         */
        this.validateByName = function (e) {
            e.preventDefault();
            var name = $scope.name;
            $http.post('api/validate/byName/' + $routeParams.event + '/' + $scope.name).then(function () {
                $success.fadeIn('fast').delay(1000).fadeOut('fast');
                $('#autoPanel input').focus();
                $scope.history.unshift({
                    date: new Date(),
                    displayName: name,
                    method: 'Nom',
                    status: true
                });
            }, errorPost('Nom', $scope.name));
            $scope.name = '';
        };

        /**
         * Error function
         * @param {string} way      'Nom' or 'Scanner'
         * @param {string} withWhat Id used to check place
         */
        function errorPost (way, withWhat) {
            return function (res) {
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

                if (withWhat.indexOf('22000000') === 0) {
                    withWhat = parseInt(withWhat.slice(8, 8 + 5));
                }

                $scope.history.unshift({
                    date: new Date(),
                    displayName: withWhat,
                    method: way,
                    okaystatus: false
                });
            }
        }

        /**
         * Filters results in both tables
         * @param {object} e The mouse event
         */
        this.filter = function (e) {
            if ($scope.filterWhat.length === 0) {
                $('table tbody tr').show();
                return;
            }

            var allTrs = $('table tbody tr');

            var hidden = allTrs.filter(function () {
                var used = $(this).children().eq(1).text();
                var pattern = $scope.filterWhat.replace(/\W/gi, '.+');
                var reg  = new RegExp(pattern, 'i');
                return !reg.test(used);
            }).hide();

            allTrs.not(hidden).show();
        };

        /**
         * Switches history local/general
         * @param {object} e      The mouse event
         * @param {string} source 'local' or 'general'
         */
        this.switchHistory = function (e, source) {
            e.preventDefault();
            $scope.currentHistory = ($scope.currentHistory === 'local') ? 'general' : 'local';
        };

        /**
         * Updates the general history
         * @param  {Function} callback callback
         */
        function updateGeneralHistory (callback) {
            EventTickets.query({
                id: $routeParams.event
            }, function (tickets) {
                $scope.globalHistory = [];
                tickets.forEach(function (ticket) {
                    if (!ticket.validatedDate) {
                        return;
                    }

                    $scope.globalHistory.push({
                        displayName: ticket.displayName,
                        validatedDate: ticket.validatedDate
                    });
                });
                callback();
            });
        }

        /**
         * Shows countdown
         */
        function countDown () {
            --countdown;
            $scope.countdown = '(' + (countdown + 1) + ')';
            if (countdown === -1) {
                return updateGeneralHistory(function () {
                    countdown = 30;
                    $timeout(countDown, 1000);
                });
            }

            $timeout(countDown, 1000);
        }

        countDown();

        window.onbeforeunload = function (e) {
            var e = e || window.event;
            if (e) {
                e.returnValue = 'Recharger la page entraîne la déconnexion.';
            }
            return 'Recharger la page entraîne la déconnexion.';
        };
  }
]);
