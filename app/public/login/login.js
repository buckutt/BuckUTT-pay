/////////////////////////////////
// Controller for tickets list //
/////////////////////////////////

'use strict';

pay.controller('Login', [
    '$scope',
    '$timeout',
    '$http',
    'PayAuth',
    function ($scope, $timeout, $http, PayAuth) {
        // Account already connected, hide the login form and auto show the connecter header
        if (!!PayAuth.etu) {
            $('.loginForm').hide();
            $('#logged').show();
            var $loginPanel = $('.loginPanel');

            var fixedHeight = {
                height: 75,
                maxHeight: 75,
                minHeight: 75
            };
            
            $loginPanel.css(fixedHeight);
            $loginPanel.children().css(fixedHeight);
            $loginPanel.children().children().css(fixedHeight);
        }

        /**
         * Animates the circles to a given size
         * @param {number}   to       The size to give to the circle
         * @param {function} callback Called when the animation is done
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
         * @param {Boolean} fail      True when the login has failed
         * @param {Boolean} wrongAuth True when the login has failed because of the username/password
         */
        function animEnd (fail, wrongAuth) {
            $('.logging').fadeOut();
            $('#okayIcon').animate({
                fontSize: 0
            }, function () {
                if (fail) {
                    if (wrongAuth) {
                        $('#password').val('');
                        $('#loginControllerWrapper').css('backgroundColor', '#e74c3c');
                        setTimeout(function () {
                            $('#loginControllerWrapper').removeAttr('style');
                            $('.loginForm').fadeIn();
                            $('#password').focus();
                        }, 600);
                        return;
                    }
                    $('.loginForm').fadeIn();
                } else {
                    $('#logged').fadeIn();
                }
            });

            $('.loginPanel').height(75);
            $('#loginControllerWrapper').css('minHeight', 0);
        }

        /**
         * Shows the modal related to the ticket lost
         * @param {object} e The click event
         */
        this.showModal = function (e) {
            e.preventDefault();
            $timeout(function () {
                $('#modalLost').modal().one('shown.bs.modal', function () {
                    $('#lostTicketsEmail').focus();
                });
            });

            $('#lostButton').click(this.forgot);
        };

        /**
         * Authenticates the user via site etu
         * @param {object} e The click event
         */
        this.authUser = function (e) {
            e.preventDefault();
            $('#password').blur();
            PayAuth.auth($('#username').val(), $('#password').val()).then(angular.noop, function (wrongAuth) {
                animEnd(true, wrongAuth);
            });

            $('.loginForm').fadeOut(function () {
                $('.logging').fadeIn(function () {
                    var callbackIn = function () {
                        animLoad(0, callbackOut);
                    };

                    var callbackOut = function () {
                        if (!PayAuth.etu) {
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
                });
            });
        };

        /**
         * Logs out the user
         * @param {object} e The click event
         */
        this.logout = function (e) {
            e.preventDefault();
            window.location.reload();
        };

        /**
         * Sends the tickets to the user mail
         * @param {object} e The click event
         */
        this.forgot = function (e) {
            var $lostTicketsEmail = $('#lostTicketsEmail');
            var $forgotOk = $('#forgotOk');
            var mail = $lostTicketsEmail.val();
            $http.get('/api/forgot/' + mail).then(function () {
                $forgotOk.slideDown().delay(2000).slideUp();
            }, function (data) {
                $('#forgotFail').html('<br>Échec de l\'envoi de mail').slideDown().delay(2000).slideUp();
            });
        };
    }
]);
