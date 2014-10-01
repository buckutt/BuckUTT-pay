// Pay - /app/public/etuAuth/etuAuth.js

// Controller for tickets list

'use strict';

pay.controller('etuAuth', [
    'SiteEtu',
    function (etu) {
        etu.checkAuth();
    }
]);