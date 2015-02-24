///////////////////////////////////////
// Controller for buckutt management //
///////////////////////////////////////

'use strict';

pay.controller('Buckutt', [
    '$scope',
    '$http',
    '$filter',
    'PayAuth',
    'Reloads',
    'Purchases',
    function ($scope, $http, $filter, PayAuth, Reloads, Purchases) {
        if (!PayAuth.needUser()) { return; }

        $scope.isRemoved = PayAuth.etu.isRemoved;

        var spyStep         = 20;
        var spyActualLength = 20;

        $scope.history = [];

        Reloads.query(function (reloads) {
            // Limit $watch triggers
            var toAdd = [];
            reloads.forEach(function (reload) {
                toAdd.push({
                    name: 'Rechargement',
                    details: reload.where,
                    date: new Date(reload.date),
                    sold: reload.price
                });
            });

            $scope.history = $scope.history.concat(toAdd);

            sortHistory();
        });

        Purchases.query(function (purchases) {
            // Limit $watch triggers
            var toAdd = [];
            
            // Add the details to 1€ pack
            var addedOneToLastPurchase = false;

            purchases.forEach(function (purchase) {
                if (purchase.price === 0) {
                    if (addedOneToLastPurchase) {
                        toAdd[toAdd.length - 1].details += ' - ' + beautfifyPurchaseName(purchase.article) + ')';
                    } else {
                        toAdd[toAdd.length - 1].details += ' (' + beautfifyPurchaseName(purchase.article);
                    }

                    addedOneToLastPurchase = !addedOneToLastPurchase;
                } else {
                    toAdd.push({
                        name: beautfifyPurchaseName(purchase.article),
                        details: 'par ' + purchase.seller + ' - ' + purchase.where,
                        date: new Date(purchase.date),
                        sold: -1 * purchase.price
                    });
                }
            });

            $scope.history = $scope.history.concat(toAdd);

            sortHistory();
        });

        $scope.$watch('history', function (history) {
            $scope.sold = 0;
            if (history) {
                history.forEach(function (action) {
                    $scope.sold += action.sold;
                });
            }

            $scope.sold = $filter('currency')($scope.sold, '€', 2);
            // Handles "(€XX.XX)" (ie. negative sold)
            $scope.sold = $scope.sold.replace(/^\(€(.*)\)$/i, '-$1€');
            // Handles "€XX.XX" (ie. positive sold)
            $scope.sold = $scope.sold.replace(/^€(.*)$/i, '$1€');

            $scope.visibleHistory = $scope.history.slice(0, spyStep);
        });

        /**
         * Loads more entries to the history
         * @param {object} e The click event
         */
        this.loadMore = function (e) {
            e.preventDefault();
            spyActualLength += spyStep;
            $scope.visibleHistory = $scope.history.slice(0, spyActualLength);
        };

        /**
         * Expands an action in the history
         * @param  {object} e     The click event
         * @param  {number} index The index of the action in the history
         */
        this.expand = function (e, index) {
            e.preventDefault();
            var action = $scope.history[index];
            var $tr = $(e.currentTarget);
            $tr.children().eq(0).children().eq(1).slideToggle('fast');
        };

        /**
         * Confirms the user when he wants to desactivate his account
         * @param  {object} e The click event
         */
        this.confirmBlock = function (e) {
            e.preventDefault();
            $('#modalConfirm').modal();
        };

        /**
         * Desactivates the user account
         * @param  {object} e The click event
         */
        this.desactivate = function (e) {
            e.preventDefault();
            $http.put('/api/etu/block').then(function () {
                $scope.isRemoved = true;
            }, function () {
                Error('Erreur', 0)
            });
        };

        /**
         * Sort the history array by the dates inside the object
         */
        function sortHistory () {
            $scope.history.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });
        }

        /**
         * Beautify the purchase title
         * @param  {string} purchaseName Article title
         * @return {string}              Beautified article title
         */
        function beautfifyPurchaseName (purchaseName) {
            var capitalized = purchaseName.toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });

            return capitalized.replace('euro', '€');
        }
    }
]);