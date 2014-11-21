// Pay - /app/public/adminEvent/adminEvent.js

// Controller for event dashboard

'use strict';

pay.controller('BuckuttAdmin', [
    '$scope',
    'PayAuth',
    'Domain',
    'BankPrice',
    'Error',
    function ($scope, PayAuth, Domain, BankPrice, Error) {
        //PayAuth.needUser();

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
          * @param {object} e - The submit event
          */
        this.editBankPrice = function (e) {
            var bankPrice = new BankPrice();
            bankPrice.value = $scope.bankPrice;
            bankPrice.$save(function () {
                
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        };

        /**
          * Creates a domain
          * @param {object} e - The submit event
          */
        this.addDomain = function (e) {
            e.preventDefault();

            var val = $('#newDomain').val();
            var domain = new Domain({
                domain: val
            });

            domain.$save(function () {
                domain.domain = val;
                $scope.domains.push(domain);
            }, function (res) {
                Error('Erreur', res.data.error);
            });
        };

        /**
          * Removes one domain
          * @param {object} e - The click event
          * @param {int} id - The domain id
          */
        this.removeDomain = function (e, id) {
            e.preventDefault();

            var self = e.target;
            Domain.remove({
                id: id
            }, function (e) {
                if (!e.status) {
                    Error('Erreur', e.error);
                    return;
                }

                $(self).parent().remove();
            });
        };
    }
]);