//////////////////////
// Site Etu factory //
//////////////////////

'use strict';

pay.factory('PayAuth', ['$http', '$q', 'Error', function ($http, $q, Error) {
    var tokenData = null;
    var etuData = null;

    function PayAuth () {
        this.token = tokenData;
        this.etu = etuData;
        var self = this;
        pay.auth = self;

        /**
          * Authenticates the user via username and password
          * @param {string} username - The username
          * @param {string} password - The password
          */
        this.auth = function (username, password) {
            return $q(function (resolve, reject) {
                $http.post('api/etu/auth', {
                    username: username,
                    password: password
                }).success(function (data) {
                    self.token = data.token;
                    self.etu = data;
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
          */
        this.needUser = function () {
            if (!this.token) {
                location.hash = '#/';
            }
        };

        /**
          * Makes the controller require admin rights
          */
        this.needAdmin = function () {
            if (!this.etu.admin) {
                location.hash = '#/';
            }
        };
    }

    return new PayAuth();
}]);
