// Pay - /app/public/adminEvent/adminEvent.js

// Controller for event dashboard

'use strict';

pay.controller('BuckuttAdmin', [
    'PayAuth',
    function (PayAuth) {
        PayAuth.needUser();
    }
]);