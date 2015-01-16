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


// Datepickers
// Set min date to now + 1 hour
var minDate = moment().add(1, 'hour').toDate();
$.extend($.fn.datetimepicker.defaults, {
    pickDate: true,
    pickTime: true,
    useMinutes: true,
    useSeconds: false,
    useCurrent: true,
    minuteStepping: 15,
    minDate: minDate,
    showToday: true,
    language: 'fr',
    useStrict: true,
    sideBySide: true,
    daysOfWeekDisabled: [0, 7]
});
