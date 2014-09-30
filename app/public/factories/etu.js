// Pay - /app/public/factories/etu.js

// Site Etu factory

'use strict';

pay.factory('SiteEtu', ['$http', function ($http) {
    function SiteEtu (baseURL) {
        /**
          * Auth a user via site etu
          * @param {}
          */
        this.auth = function (clientId) {
            var url = baseURL + 'oauth/authorize?client_id=' +
                      clientId + '&scopes=public%20private_user_account&response_type=code&state=buckutt';
            var params = 'location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0,width=490,height=650';
            window.open(url, '_blank', params);
            window.addEventListener('message', function (e) {
                console.log(e.data);
            }, false);
        };

        /**
          * Check if the popup has a code in the query (opened with auth())
          */
        this.checkAuth = function () {
            // location.search = ?code=8a0d56bfe3eb6cb5ff67ab888d31bb211f70fb21&state=buckutt
            var query = location.search.split('?code=');
            if (query.length !== 2) {
                return;
            }

            var code = query[1].split('&')[0];

            $http.post('api/authEtu', JSON.stringify({
                code: code
            })).success(function (data) {
                if (data.http.status === 200) {
                    var accessToken = data.response.access_token;
                    window.opener.postMessage(accessToken, '*');
                    window.close();
                }
            });
        };
    }

    return new SiteEtu('https://etu.utt.fr/api/');
}]);