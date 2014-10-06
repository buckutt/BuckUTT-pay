// Pay - /app/public/ticketsList/ticketsList.js

// Controller for tickets list

'use strict';

pay.controller('TicketsList', [
    '$scope',
    '$timeout',
    'Debounce',
    'SiteEtu',
    'Event',
    'Error',
    function ($scope, $timeout, debounce, etu, Event, Error) {
        // Shows events list
        Event.query(function (events) {
            $scope.events = events;
        });

        // Calcs the ideal tile height
        function calcTileHeight () {
            var browserWidth = $(window).width();
            var colHeight = 80;
            if (768 <= browserWidth && browserWidth <= 992) {
                colHeight = 96;
            }
            if (browserWidth > 992) {
                colHeight = 130;
            }

            return colHeight;
        }
        var colHeight = calcTileHeight();

        /**
          * Shows the modal related to the ticket lost
          * @param {object} e - The click event
          */
        this.showModal = function (e) {
            e.preventDefault();
            $timeout(function () {
                $('#modalLost').modal();
            });
        };

        /**
         * Shows the three means of payment for the event
         * @param {object} e - The click event 
         */
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

        /**
         * Hides the three means of payment for the event
         * @param {object} e - The click event 
         */
        this.hideBuyingCards = function (e) {
            $(e.currentTarget)
                .parent().parent()
                    .removeClass('flipInX active')
                    .addClass('animated flipOutX')
                .prev()
                    .removeClass('flipOutX')
                    .addClass('animated flipInX active');

            $('.expended').removeClass('expended').height(colHeight);
        };

        /**
         * Shows the tooltip for the mean of payment
         * @param {object} e - The mouseover event 
         */
        this.showTooltip = function (e) {
            $(e.currentTarget).next().addClass('active');
        };

        /**
         * Hides the tooltip for the mean of payment
         * @param {object} e - The mouseout event 
         */
        this.hideTooltip = function (e) {
            $(e.currentTarget).next().removeClass('active');
        };

        /**
         * Shows the form for the mean of payment
         * @param {object} e - The click event 
         * @param {string} meanOfPayment - The mean of payment (buckutt, cash, card)
         */
        this.expendBuy = function (e, meanOfPayment) {
            var $self = $(e.currentTarget);
            var $selfRow = $self.parent().parent();
            var $selfCol = $self.parent().parent().parent().parent().parent();
            var $target = $selfRow.siblings('.row.paywith.' + meanOfPayment);

            if (!$target.hasClass('active')) {
                var newHeight = $selfRow.height() + $target.height();
                $selfCol.addClass('expended').height(newHeight);

                var $othersTargets = $target.siblings('.paywith').removeClass('active');
                $target
                    .insertBefore($othersTargets.first())
                    .addClass('active');
            } else {
                $selfCol.removeClass('expended').height(colHeight);
                $target.removeClass('active');
            }
        };

        /**
         * Checks if the active form has to be resized (mediaquery-like)
         * @param {string} meanOfPayment - The mean of payment (buckutt, cash, card)
         */
        this.checkExpended = function (meanOfPayment) {
            var $lastElem = $.data(document.body, '$lastElem');
            colHeight = calcTileHeight();
            debounce(function () {
                var $expended = $('.expended');

                if ($expended.length > 0) {
                    var $selfRow = $lastElem.parent();
                    var $target = $selfRow.siblings('.row.paywith.' + meanOfPayment);
                    var newHeight = $selfRow.height() + $target.height();

                    if ($expended.height() !== newHeight) {
                        $('.expended').height(newHeight);
                    }
                }
            }, 100);
        };
}]);
