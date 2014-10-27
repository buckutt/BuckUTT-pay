// Pay - /app/public/factories/etu.js

// Site Etu factory

'use strict';

pay.factory('PayAuth', ['$http', '$q', 'Error', function ($http, $q, Error) {
    var etuData = null;

    function PayAuth () {
        this.etu = etuData;

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
                    resolve(data);
                }).error(function (data, status, headers) {
                    // Custom handle wrong auth
                    if (data.error === 4) {
                        reject(true);
                        return;
                    }
                    Error('Erreur', data.error);
                    reject(false);
                });
            });
        };

        /**
          * Try to auth via the localstorage data
          */
        this.renewAuth = function () {
            return $q(function (resolve, reject) {
                $http.post('api/etu/auth', createToken(username, password)).success(function () {
                    resolve();
                }).error(function (data, status, headers) {
                    console.log(data);
                    reject();
                });
            });
        };
    }

    return new PayAuth();
}]);