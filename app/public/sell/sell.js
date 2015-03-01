///////////////////////////////
// Tickets seller controller //
///////////////////////////////

'use strict';

pay.controller('Sell', [
  '$scope',
  '$http',
  '$routeParams',
  'PayAuth',
  function ($scope, $http, $routeParams, PayAuth) {
        if (!PayAuth.needUser()) { return; }

        /**
         * Switch vendor/validate
         */
        this.switchPage = function () {
          location.hash = '/validate/' + $routeParams.event;
        };
  }
]);