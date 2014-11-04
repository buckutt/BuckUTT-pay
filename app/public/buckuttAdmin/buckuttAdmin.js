// Pay - /app/public/adminEvent/adminEvent.js

// Controller for event dashboard

'use strict';

pay.controller('BuckuttAdmin', [
    '$scope',
    'PayAuth',
    'Domain',
    function ($scope, PayAuth, Domain) {
        //PayAuth.needUser();

        // Shows domains list
        Domain.query(function (domains) {
            $scope.domains = domains;
        });

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
                console.log(domain);
                $scope.domains.push(domain);
            }, function () {
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