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
        .otherwise({
            redirectTo: '/'
        });
}]);

// Auth token
pay.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter, status) {
        if (pay.hasOwnProperty('auth') && pay.auth.token) {
            if (data) {
                data.token = pay.auth.etu.token
                data.username = pay.auth.etu.username
            } else {
                data = {
                    token: pay.auth.etu.token,
                    username: pay.auth.etu.username
                };
            }
        }
        return data;
    });
}]);

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
