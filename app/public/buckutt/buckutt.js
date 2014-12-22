// Pay - /app/public/buckutt/buckutt.js

// Controller for buckutt management

'use strict';

pay.controller('Buckutt', [
    '$scope',
    'PayAuth',
    function ($scope, PayAuth) {
        PayAuth.needUser();
    }
]);