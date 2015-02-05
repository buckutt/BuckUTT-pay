//////////////////////
// Site Etu factory //
//////////////////////

'use strict';

pay.factory('PayAuth', [
    '$http',
    '$q',
    '$rootScope',
    'Error',
    function ($http, $q, $rootScope, Error) {
        var tokenData = null;
        var etuData = null;

        function PayAuth () {
            this.etu = etuData;
            var self = this;
            pay.auth = self;

            /**
             * Authenticates the user via username and password
             * @param {string} username The username
             * @param {string} password The password
             */
            this.auth = function (username, password) {
                return $q(function (resolve, reject) {
                    $http.post('api/etu/login', {
                        username: username,
                        password: password
                    }).success(function (data) {
                        self.etu = data;
                        $rootScope.$emit('payauth:logged');
                        resolve(data);
                    }).error(function (data, status, headers) {
                        if (!data) {
                            Error('Erreur', 15);
                            return;
                        }

                        // Custom handle wrong auth
                        if (data && data.error === 4) {
                            reject(true);
                            return;
                        }
                        Error('Erreur', data.error);
                        reject(false);
                    });
                });
            };

            /**
             * Makes the controller require auth
             * @return {Boolean} True if the user is auth
             */
            this.needUser = function () {
                if (!this.etu) {
                    location.hash = '#/';
                    return false;
                }
                return true;
            };

            /**
              * Makes the controller require admin rights
              * @return {Boolean} True if the user is admin
              */
            this.needAdmin = function () {
                if (!this.etu || !this.etu.isAdmin) {
                    location.hash = '#/';
                    return false;
                }
                return true;
            };
        }

        return new PayAuth();
    }
]);
