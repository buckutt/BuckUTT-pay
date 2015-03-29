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
        $scope.euroPattern = /^((\d\d(\.\d{0,2})?)|([5-9](\.\d{0,2})?))$/;

        var spyStep         = 20;
        var spyActualLength = 20;

        $scope.history = [];
        $scope.totalHistory = false;

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

            purchases.forEach(function (purchase, i) {
                if (purchase.article === 'FORMULE 1EURO') {
                    var details = 'par ' + purchase.seller + ' - ' + purchase.where;
                    details += ' (' + beautfifyPurchaseName(purchases[i + 1].article);
                    details += ' - ' + beautfifyPurchaseName(purchases[i + 2].article);
                    details += ')';
                    toAdd.push({
                        name: 'Formule 1€',
                        details: details,
                        date: new Date(purchase.date),
                        sold: -1 * purchase.price
                    });
                } else if (purchase.price === 0) {
                    return;
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

            $scope.visibleHistory = $scope.history.slice(0, spyStep);

            $scope.sold = PayAuth.etu.credit / 100;
        });

        /**
         * Loads more entries to the history
         * @param {object} e The click event
         */
        this.loadMore = function (e) {
            e.preventDefault();
            spyActualLength += spyStep;
            $scope.visibleHistory = $scope.history.slice(0, spyActualLength);
            if ($scope.visibleHistory.length === $scope.history.length) {
                $scope.totalHistory = true;
            }
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
            var $btn = $(e.currentTarget).attr('disabled', '');
            $http.put('/api/etu/block').then(function () {
                $btn.removeAttr('disabled');
                $scope.isRemoved = true;
            }, function () {
                $btn.removeAttr('disabled');
                Error('Erreur', 0);
            });
        };

        /**
         * Shows the modal to reload the account
         * @param  {object} e The click event
         */
        this.showReload = function (e) {
            e.preventDefault();
            $('#modalReload').modal().one('shown.bs.modal', function () {
                $('#reloadAmount').focus();
            });
        };

        /**
         * Reloads the account
         * @param  {object} e The click event
         */
        this.reload = function (e) {
            e.preventDefault();
            $http.get('/api/reload/' + parseInt($scope.amount * 100)).then(function (res) {
                $('body').append(res.data.form).children('form').last().submit();
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