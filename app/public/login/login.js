// Pay - /app/public/login/login.js

// Controller for tickets list

'use strict';

pay.controller('Login', [
    '$scope',
    'SiteEtu',
    function ($scope, etu) {
        // Refresh token if possible
        etu.pleaseRefreshToken(treatLoading, treatUserData);

        /**
          * Auth the user via site etu
          * @param {object} e - The click event
          */
        this.authUser = function (e) {
            e.preventDefault();
            etu.auth('11196275875', treatUserData);
        };

        /**
          * Shows the username
          */
        function treatUserData (data) {
            $scope.user = window.x = data;
            $('#refreshLoader').addClass('hidden');
            $('#connectLink').hide().next().text('Bonjour, ' + data.fullName).show();
        };

        function treatLoading () {
            $('#refreshLoader').removeAttr('class');
            $('#connectLink').hide();
        }
    }
]);