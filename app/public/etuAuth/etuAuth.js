// Pay - /app/public/etuAuth/etuAuth.js

// Controller for storing data from oauth

'use strict';

pay.controller('EtuAuth', [
    'SiteEtu',
    function (SiteEtu) {
        SiteEtu.checkAuth();
    }
]);
