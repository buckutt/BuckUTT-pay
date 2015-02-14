///////////////////////////////////////
// Controller for buckutt management //
///////////////////////////////////////

'use strict';

pay.controller('Reset', [
    '$scope',
    '$http',
    '$routeParams',
    'PayAuth',
    function ($scope, $http, $routeParams, PayAuth) {
        if (PayAuth.etu) {
            // Classic password change
            $scope.classic = true;
        } else {
            if (!$routeParams.token) {
                return location.hash = '/';
            }

            $scope.classic = false;

            // Reset by mail
            var $newpwd1;
            var $newpwd2;
            var $status;

            // Inputs not here yet
            setTimeout(function () {
                $newpwd1 = $('#newpwd1');
                $newpwd2 = $('#newpwd2');
                $status  = $('#status');
                $newpwd1.focus();
            });

            this.validatePwds = function (e) {
                if (e.charCode === 13 || e.keyCode === 13 || e.which === 13) {
                    return e.preventDefault();
                }

                var v1 = $newpwd1.val();
                var v2 = $newpwd2.val();
                if (v1 !== v2) {
                    $status.text('Mots de passe non identiques').removeClass().addClass('text-warning');
                    $newpwd1.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                    $newpwd2.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                } else {
                    if (v1.length > 7) {
                        $status.text('Mots de passe valides').removeClass().addClass('text-success');
                        $newpwd1.removeClass('ng-pristine ng-invalid').addClass('ng-valid');
                        $newpwd2.removeClass('ng-pristine ng-invalid').addClass('ng-valid');
                    } else {
                        $status.text('Mots de passe trop courts').removeClass().addClass('text-warning');
                    }
                }
            };

            /**
             * Gives the next password field the focus
             * @param {object} e The keypress event
             */
            this.next = function (e) {
                if (e.charCode === 13 || e.keyCode === 13 || e.which === 13) {
                    e.preventDefault();
                    $newpwd2.focus();
                }
            }

            /**
             * Resets the user password
             * @param {object} e The keypress event
             */
            this.reset = function (e) {
                if (e.charCode === 13 || e.keyCode === 13 || e.which === 13) {
                    e.preventDefault();

                    var newpwd1 = $('#newpwd1');
                    $http.put('/api/reset/' + $routeParams.token, {
                        password: newpwd1.val()
                    }).then(function () {
                        $status.text('Mot de passe changé. Vous pouvez vous reconnecter').removeClass().addClass('text-success');
                    }, function () {
                        $status.text('Échec du changement de mot de passe.').removeClass().addClass('text-danger');
                    });
                }
            };
        }
    }
]);
