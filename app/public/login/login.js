// Pay - /app/public/login/login.js

// Controller for tickets list

'use strict';

pay.controller('Login', [
    '$scope',
    'SiteEtu',
    function ($scope, SiteEtu) {
        // Refreshes token if possible
        SiteEtu.pleaseRefreshToken(treatLoading, treatUserData);

        /**
          * Authenticates the user via site etu
          * @param {object} e - The click event
          */
        this.authUser = function (e) {
            e.preventDefault();
            SiteEtu.auth('11196275875', treatUserData);
        };

        /**
          * Shows the username
          */
        function treatUserData (data) {
            SiteEtu.etu = data;
            $scope.etu = window.x = data;

            $('.loading').hide();

            $('.connected').show();

            /* if (data.isAssoAdmin) */
            if (1) {
                $('.admin').show();
            } else {
                $('.admin').hide();
            }

            $('.welcoming').text('Bonjour, ' + data.fullName).show();
        }

        function treatLoading () {
            $('.guest').hide();
            $('.loading').show();
        }
    }
]);