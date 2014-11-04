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