// Pay - /app/public/login/login.js

// Controller for tickets list

'use strict';

pay.controller('Login', [
    '$scope',
    '$timeout',
    'SiteEtu',
    function ($scope, $timeout, SiteEtu) {
        // Refreshes token if possible
        var isRefreshing = SiteEtu.pleaseRefreshToken(treatLoading, treatUserData);

        console.log(isRefreshing);
        if (isRefreshing === 0) {
            $('#loginIcon').addClass('canConnect');
        }

        /**
          * Shows the loading icons
          */
        function treatLoading () {
            $('.guest').hide();
            setTimeout(function () {
                $('#loginController').addClass('connecting');
            }, 100);

            var callbackIn = function () {
                animLoad(0, callbackOut);
            };

            var callbackOut = function () {
                if (!$scope.etu) {
                    animLoad(90, callbackIn);
                }
            };

            animLoad(90, callbackIn);
        }

        function animLoad (to, callback) {
            $('#loginLoader').animate({
                height: to,
                width: to,
                top: '-' + (to / 2) + 'px',
                left: '-' + (to / 2) + 'px'
            }, {
                done: function () {
                    setTimeout(function () {
                        callback();
                    }, 100);
                },
                duration: 300
            }, 'easeInOutExpo');
        }

        /**
          * Shows the username
          * @param {function} data - The user data
          */
        function treatUserData (data) {
            SiteEtu.etu = data;
            $scope.etu = window.x = data;

            $('#loginController').addClass('connecting');
            $('#loginIcon').addClass('iconHide');
            $('#okayIcon').addClass('iconShow');
            $('#buttonLost').fadeOut();
            setTimeout(function () {
                $('#okayIcon').removeClass('iconShow');
                $('#loginController').removeClass('connecting');
                $('#logged').removeClass('loggedHide');
                $('.loginPanel').addClass('logged');
            }, 1000);

            $('.connected').show();

            /* if (data.isAssoAdmin) */
            if (1) {
                $('.admin').show();
            } else {
                $('.admin').hide();
            }

            $('.welcoming').text('Bonjour, ' + data.fullName).show();
        }

        /**
          * Shows the modal related to the ticket lost
          * @param {object} e - The click event
          */
        this.showModal = function (e) {
            e.preventDefault();
            $timeout(function () {
                $('#modalLost').modal();
            });
        };

        /**
          * Authenticates the user via site etu
          * @param {object} e - The click event
          */
        this.authUser = function (e) {
            e.preventDefault();
            SiteEtu.auth('11196275875', treatUserData);
        };

        /**
          * Logs out the user
          * @param {object} e - The click event
          */
        this.logout = function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.reload();
        };
    }
]);