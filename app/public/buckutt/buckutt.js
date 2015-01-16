///////////////////////////////////////
// Controller for buckutt management //
///////////////////////////////////////

'use strict';

pay.controller('Buckutt', [
    '$scope',
    'PayAuth',
    function ($scope, PayAuth) {
        PayAuth.needUser();

        $scope.history = [
            {
                name: 'Rechargement de compte',
                date: new Date(),
                sold: 7
            },
            {
                name: 'Formule 1€',
                date: new Date(),
                sold: -1
            }
        ];

        $scope.$watch('history', function (history) {
            $scope.sold = 0;
            history.forEach(function (action) {
                $scope.sold += action.sold;
            });
        });

        /**
         * Expand an action in the history
         * @param  {object} e     The click event
         * @param  {number} index The index of the action in the history
         */
        this.expand = function (e, index) {
            e.preventDefault();
            var action = $scope.history[index];
            var $tr = $(e.currentTarget);
            $tr.children().eq(0).children().eq(1).slideToggle('fast');
        }
    }
]);