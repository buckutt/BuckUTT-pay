// Pay - /app/ticketsList/ticketsList.js

// Controller for tickets list
'use strict';

// pay.module is not defined
pay.controller('ticketsList', ['$scope', function ($scope) {
        $scope.events = [
            {
                name: 'Gala UTT 2015',
                picture: 'gala2015.png',
                description: 'Viens au gala on est bien bien bien bien',
                date: new Date(2015, 5, 20, 20, 0, 0)
            },
            {
                name: 'Gala UTT 2015 Bis',
                picture: 'gala2015.png',
                description: 'Bis Viens au gala on est bien bien bien bien',
                date: new Date(2015, 5, 20, 20, 0, 0)
            }
        ];

        this.showBuyingCards = function (e) {
            $(e.currentTarget).parent().removeClass('flipInX').addClass('animated flipOutX').next().removeClass('flipOutX').addClass('animated flipInX');
        };

        this.hideBuyingCards = function (e) {
            $(e.currentTarget).parent().parent().addClass('animated flipOutX').prev().removeClass('flipOutX').addClass('animated flipInX');
        };

        this.showTooltip = function (e) {
            $(e.currentTarget).next().addClass('active');
        };

        this.hideTooltip = function (e) {
            $(e.currentTarget).next().removeClass('active');
        };
}]);