// Pay - /app/public/factories/etu.js

// Site Etu factory

'use strict';

pay.factory('SiteEtu', ['$http', 'Error', function ($http, error) {
    var etuData = null;

    function SiteEtu (baseURL) {
        var rights = [
            'public',
            'private_user_account',
            'private_user_organizations'
        ].join('+');

        this.token = null;

        this.etu = etuData;

        /**
          * Checks if the user browser is IE (window.opener is not supported)
          */
        this.isIE = function () {
            var msie = navigator.userAgent.indexOf('MSIE') > -1;
            var trident = navigator.userAgent.indexOf('Trident') > -1;
            return msie || trident;
        };

        /**
          * Authenticates a user via site etu
          * @param {string} clientId - The site etu buckutt's clientid
          * @param {function} callback - Callback called when the popup gets an answer
          */
        this.auth = function (clientId, callback) {
            var url = baseURL + 'oauth/authorize?client_id=' +
                      clientId + '&scopes=' + rights;
            var params = 'location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0,width=490,height=741';

            if (this.isIE()) {
                params = 'dialogWidth=490,dialogHeight=650,resizable=0,scroll=0,status=0';
                window.showModalDialog(url, window, params);
                window.onMessage = function (data) {
                    localStorage.setItem('refreshToken', e.data.refreshToken);
                    localStorage.setItem('date', (new Date()).getTime());
                    callback(data);
                };
            } else {
                window.open(url, '_blank', params);
                window.addEventListener('message', function (e) {
                    localStorage.setItem('refreshToken', e.data.refreshToken);
                    localStorage.setItem('date', (new Date()).getTime());
                    callback(e.data);
                }, false);
            }
        };

        /**
          * Checks if the popup has a code in the query (opened with auth())
          */
        this.checkAuth = function () {
            var isIE = this.isIE;

            // location.search = ?authorization_code=8a0d56bfe3eb6cb5ff67ab888d31bb211f70fb21&state=buckutt
            var query = location.href.split('?authorization_code=');
            if (query.length !== 2) {
                return;
            }

            var code = query[1];

            $http.post('api/authEtu', JSON.stringify({
                code: code
            })).success(function (data) {
                if (isIE()) {
                    window.dialogArguments.onMessage(data);
                } else {
                    window.opener.postMessage(data, '*');
                    window.close();
                }
            }).error(function (data, status, headers) {
                error('Erreur', data.error);
            });
        };

        /**
          * Checks if the refresh token is here and still viable
          * @param {function} loadingCallback - Called when the refresh token is being refreshed
          * @param {function} callback - Called when the refresh token has been refreshed
          */
        this.pleaseRefreshToken = function (loadingCallback, callback) {
            if (this.etu !== null) {
                loadingCallback();
                callback(this.etu);
                return;
            }

            var token = localStorage.getItem('refreshToken');
            var date = localStorage.getItem('date');
            var oneMonth = 1000 * 60 * 60 * 24 * 30;

            if (token && date) {
                if ((new Date()) - date < oneMonth) {
                    loadingCallback();
                    $http.post('api/authEtu', JSON.stringify({
                        refreshToken: token
                    })).success(function (data) {
                        // Refresh token is not refreshable anymore
                        /*localStorage.setItem('refreshToken', data.refreshToken);
                        localStorage.setItem('date', (new Date()).getTime());*/
                        callback(data);
                    }).error(function (data, status, headers) {
                        error('Erreur', data.error);
                    });
                }
            }
        };
    }

    return new SiteEtu('https://etu.utt.fr/api/');
}]);