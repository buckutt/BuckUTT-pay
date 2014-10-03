// Pay - /app/public/login/login.js

// Controller for tickets list

'use strict';

pay.controller('Login', [
    '$scope',
    'SiteEtu',
    function ($scope, etu) {
        // Refreshes token if possible
        etu.pleaseRefreshToken(treatLoading, treatUserData);

        /**
          * Authenticates the user via site etu
          * @param {object} e - The click event
          */
        this.authUser = function (e) {
            e.preventDefault();
            etu.auth('11196275875', treatUserData);
        };

        $('.guest-hidden').hide();

        /**
          * Shows the username
          */
        function treatUserData (data) {
            $scope.user = window.x = data;

            // Shows guest-hidden elements, hides admin elements
            $('.guest-hidden').show();
            
            /* if (data.isAssoAdmin) */
            if (1) {
                $('.notadmin-hidden').show();
            } else {
                $('.notadmin-hidden').hide();
            }

            $('.connected-hidden').hide();
            $('.admin-hidden').hide();

            $('#connectLink').next().text('Bonjour, ' + data.fullName).show();
        }

        function treatLoading () {
            $('.loading-hidden').hide();
        }
    }
]);