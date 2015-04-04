//////////////////////////////////////////////////
// Controller for buckutt global administration //
//////////////////////////////////////////////////

'use strict';

pay.controller('BuckuttAdmin', [
    '$scope',
    'PayAuth',
    'Domain',
    'BankPrice',
    'Error',
    function ($scope, PayAuth, Domain, BankPrice, Error) {
        if (!PayAuth.needAdmin()) { return; }

        // Shows domains list
        Domain.query(function (domains) {
            $scope.domains = domains;
        });

        // Get the bank price
        BankPrice.get(function (data) {
            $scope.bankPrice = data.bankPrice;
        });

        /**
         * Edit the bank price
         * @param {object} e The submit event
         */
        this.editBankPrice = function (e) {
            var $btn = $(e.currentTarget).find('button[type="submit"]').attr('disabled', '');
            var bankPrice = new BankPrice();
            bankPrice.value = $scope.bankPrice;
            bankPrice.$save(function () {
                $btn.removeAttr('disabled');
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Creates a domain
         * @param {object} e The submit event
         */
        this.addDomain = function (e) {
            var $btn = $(e.currentTarget).find('button[type="submit"]').attr('disabled', '');
            e.preventDefault();

            var val = $('#newDomain').val();
            $('#newDomain').val('');
            var domain = new Domain({
                domain: val
            });

            domain.$save(function () {
                console.log(domain);
                $btn.removeAttr('disabled');
                domain.domain = val;
                $scope.domains.push(domain);
            }, function (res) {
                $btn.removeAttr('disabled');
                Error('Erreur', res.data.error);
            });
        };

        /**
         * Removes one domain
         * @param {object} e  The click event
         * @param {number} id The domain id
         */
        this.removeDomain = function (e, id) {
            e.preventDefault();

            var $self = $(e.currentTarget);
            Domain.remove({
                id: id
            }).$promise.then(function (res) {
                $self.parent().remove();
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        };
    }
]);
