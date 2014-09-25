// Pay - /app/ticketsList/ticketsList.js

// Controller for tickets list
'use strict';

pay.controller('ticketsList', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.events = [
            {
                name: 'Gala 2015',
                picture: 'gala2015.png',
                description: 'Viens au gala on est bien bien bien bien',
                date: new Date(2015, 5, 20, 20, 0, 0)
            },
            {
                name: 'R2D A2015',
                picture: 'gala2015.png',
                description: 'Bis Viens au gala on est bien bien bien bien',
                date: new Date(2015, 5, 20, 20, 0, 0)
            }
        ];

        var browserWidth = $(window).width();
        var colWidth = 80;
        if (768 <= browserWidth && browserWidth <= 992) {
            colWidth = 96;
        }
        if (browserWidth > 992) {
            colWidth = 130;
        }

        this.showBuyingCards = function (e) {
            // Hide others buying tiles
            $('i.fa.fa-times').each(function () {
                var $self = $(this);
                if ($self.parent().parent().hasClass('active')) {
                    // Trigger break active cycle. Pass the trigger to the next cycle
                    $timeout(function () {
                        $self.trigger('click');
                    });
                }
            });

            $(e.currentTarget)
                .parent()
                    .removeClass('flipInX active')
                    .addClass('animated flipOutX')
                .next()
                    .removeClass('flipOutX')
                    .addClass('animated flipInX active');
        };

        this.hideBuyingCards = function (e) {
            $(e.currentTarget)
                .parent().parent()
                    .removeClass('flipInX active')
                    .addClass('animated flipOutX')
                .prev()
                    .removeClass('flipOutX')
                    .addClass('animated flipInX active');

            $('.expended').removeClass('expended').height(colWidth);
        };

        this.showTooltip = function (e) {
            $(e.currentTarget).next().addClass('active');
        };

        this.hideTooltip = function (e) {
            $(e.currentTarget).next().removeClass('active');
        };

        this.expendBuy = function (e, meanOfPayment) {
            var $self = $(e.currentTarget);
            var $selfRow = $self.parent().parent();
            var $selfCol = $self.parent().parent().parent().parent().parent();
            var newHeight = $selfRow.height() + $selfRow.siblings('.row.paywith.' + meanOfPayment).height();
            
            if ($selfCol.hasClass('expended')) {
                $selfCol.removeClass('expended').height(colWidth);
            } else {
                $selfCol.addClass('expended').height(newHeight);
            }
        };
}]);