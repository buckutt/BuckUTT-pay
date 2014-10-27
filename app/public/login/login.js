// Pay - /app/public/login/login.js

// Controller for tickets list

'use strict';

pay.controller('Login', [
    '$scope',
    '$timeout',
    'PayAuth',
    function ($scope, $timeout, PayAuth) {
        // Refreshes token if possible
        var isRefreshing = 0;

        if (isRefreshing === 0) {
            $('#loginIcon').addClass('canConnect');
        }

        /**
          * Animate the circles to a given size
          * @param {int} to - The size to give to the circle
          * @param {function} callback - Called when the animation is done
          */
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
          * Triggered when the login has been done or not
          * @param {bool} fail - True when the login has failed
          * @param {bool} wrongAuth - True when the login has failed because of the username/password
          */
        function animEnd (fail, wrongAuth) {
            $('.logging').fadeOut();
            $('#okayIcon').animate({
                fontSize: 0
            }, function () {
                if (fail) {
                    if (wrongAuth) {
                        $('#loginControllerWrapper').css('backgroundColor', '#e74c3c');
                        setTimeout(function () {
                            $('#loginControllerWrapper').removeAttr('style');
                            $('.loginForm').fadeIn();
                        }, 600);
                        return;
                    }
                    $('.loginForm').fadeIn();
                } else {
                    $('#logged').fadeIn();
                }
            });
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
            PayAuth.auth($('#username').val(), $('#password').val()).then(function (etu) {
                $scope.etu = etu;
            }, function (wrongAuth) {
                animEnd(true, wrongAuth);
            });

            $('.loginForm').fadeOut();
            $('.logging').fadeIn();

            var callbackIn = function () {
                animLoad(0, callbackOut);
            };

            var callbackOut = function () {
                if (!$scope.etu) {
                    animLoad(65, callbackIn);
                } else {
                    $('#okayIcon').animate({
                        fontSize: 60
                    }, function () {
                        setTimeout(animEnd, 400);
                    });
                }
            };

            animLoad(65, callbackIn);
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