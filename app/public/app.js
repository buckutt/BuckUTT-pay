//////////////////////
// Main entry point //
//////////////////////

'use strict';

var pay = angular.module('pay', [
    'ngRoute',
    'ngResource'
]).run(function ($rootScope) {
    // This will removes everything under scripts : modal divs, autocompletion divs, etc.
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $('body > script').last().nextUntil().remove();
    });
});

pay.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'ticketsList/ticketsList.html'
        })
        .when('/etuAuth', {
            templateUrl: 'etuAuth/etuAuth.html'
        })
        .when('/admin', {
            templateUrl: 'admin/admin.html'
        })
        .when('/admin/event/:eventId', {
            templateUrl: 'adminEvent/adminEvent.html'
        })
        .when('/buckuttAdmin', {
            templateUrl: 'buckuttAdmin/buckuttAdmin.html'
        })
        .when('/buckutt', {
            templateUrl: 'buckutt/buckutt.html'
        })
        .when('/reset/:token', {
            templateUrl: 'reset/reset.html'
        })
        .when('/validate/:event', {
            templateUrl: 'validate/validate.html'
        })
        .when('/sell/:event', {
            templateUrl: 'sell/sell.html'
        })
        .when('/assignateCard/:event', {
            templateUrl: 'assignateCard/assignateCard.html'
        })
        .when('/assignateBirthdate/:event', {
            templateUrl: 'assignateBirthdate/assignateBirthdate.html'
        })
        .when('/ticketBought', {
            templateUrl: 'ticketBought/ticketBought.html'
        })
        .when('/ticketBought/:userdata', {
            templateUrl: 'ticketBought/ticketBought.html'
        })
        .when('/ticketBuyingFail', {
            templateUrl: 'ticketBoughtFail/ticketBoughtFail.html'
        })
        .when('/reloadSuccess/:userdata', {
            templateUrl: 'reloadSuccess/reloadSuccess.html'
        })
        .when('/reloadFail', {
            templateUrl: 'reloadFail/reloadFail.html'
        })
        .when('/createTicket/:event', {
            templateUrl: 'createTicket/createTicket.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Auth token
pay.config(['$httpProvider', function ($httpProvider) {
    // Bring back the xhr header
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $httpProvider.interceptors.push(function () {
        return {
            request: function (config) {
                if (pay.auth && pay.auth.etu && pay.auth.etu.jwt) {
                    config.headers['Auth-JWT'] = pay.auth.etu.jwt;
                }
                return config;
            }
        };
    });
}]);

// Auth token for jQuery
$.ajaxSetup({
    beforeSend: function(xhr, options) {
        if (pay.auth && pay.auth.etu && pay.auth.etu.jwt) {
            xhr.setRequestHeader('Auth-JWT', pay.auth.etu.jwt);
            if (options.url.indexOf('/api/etu/search/?query=') === 0) {
                var matches = location.hash.match(/\/event\/(\d+)/i);
                xhr.setRequestHeader('PassEventIdEvenWithCustomAutocompletePlugin', matches[1]);
            }
        }
    }
});

// Datepickers
// Set min date to now + 1 hour
var minDate = moment().add(1, 'hour').toDate();
$.extend($.fn.datetimepicker.defaults, {
    useCurrent: true,
    stepping: 15,
    minDate: minDate,
    showTodayButton: false,
    locale: 'fr',
    useStrict: true,
    sideBySide: true,
    daysOfWeekDisabled: [0, 7]
});
