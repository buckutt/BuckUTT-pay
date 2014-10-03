// Pay - /app/public/factories/etu.js

// Site Etu factory

'use strict';

pay.factory('SiteEtu', ['$http', 'Error', function ($http, error) {
    function SiteEtu (baseURL) {
        this.token = null;

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
          */
        this.auth = function (clientId, callback) {
            var url = baseURL + 'oauth/authorize?client_id=' +
                      clientId + '&scope=public%20private_user_account&response_type=code&state=buckutt';
            var params = 'location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0,width=490,height=650';

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

            // location.search = ?code=8a0d56bfe3eb6cb5ff67ab888d31bb211f70fb21&state=buckutt
            var query = location.search.split('?code=');
            if (query.length !== 2) {
                return;
            }

            var code = query[1].split('&')[0];

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
                console.log(data, status, headers);
                error('Erreur', data.error);
            });
        };

        /**
          * Checks if the refresh token is here and still viable
          */
        this.pleaseRefreshToken = function (loadingCallback, callback) {
            var token = localStorage.getItem('refreshToken');
            var date = localStorage.getItem('date');
            var oneMonth = 1000 * 60 * 60 * 24 * 30;

            if (token && date) {
                if ((new Date()) - date < oneMonth) {
                    loadingCallback();
                    $http.post('api/authEtu', JSON.stringify({
                        refreshToken: token
                    })).success(function (data) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                        localStorage.setItem('date', (new Date()).getTime());
                        callback(data);
                    }).error(function (data, status, headers) {
                        console.log(data, status, headers);
                        error('Erreur', data.error);
                    });
                }
            }
        };
    }

    return new SiteEtu('https://etu.utt.fr/api/');
}]);