/////////////////////////////////
// Controller for tickets list //
/////////////////////////////////

'use strict';

pay.controller('TicketsList', [
    '$scope',
    '$rootScope',
    '$timeout',
    'Event',
    'Error',
    'PayAuth',
    function ($scope, $rootScope, $timeout, Event, Error, PayAuth) {
        // Shows events list
        Event.query(function (events) {
            $scope.events = events;
            $rootScope.$on('payauth:logged', function () {
                var eventsIds = $scope.events.map(function (e) { return e.id; });
                var ticketsEvIds = PayAuth.etu.tickets.map(function (t) { return t.event_id; });
                eventsIds.forEach(function (id) {
                    if (ticketsEvIds.indexOf(id) === -1) {
                        return;
                    } else {
                        $scope.events.forEach(function (e) {
                            if (e.id === id) {
                                e.isBought = true;
                                var ticket = PayAuth.etu.tickets[ticketsEvIds.indexOf(id)];
                                e.ticketBoughtId = ticket.id;
                            }
                        });
                    }
                });
            });
        });

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

            $('.expended').removeClass('expended').removeAttr('style');
        };

        /**
         * Shows the form for the mean of payment
         * @param {object} e - The click event 
         * @param {string} meanOfPayment - The mean of payment (buckutt, card)
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
                $selfCol.removeClass('expended').removeAttr('style');
                $target.removeClass('active');
            }
        };

        /**
         * Prints the ticket
         * @param  {object} e              The click event
         * @param  {number} ticketBoughtId The ticket id
         */
        this.print = function (e, ticketBoughtId) {
            e.preventDefault();
            var url = location.href.replace(location.hash, '');
            url += 'api/print/' +
                   '?ticketId=' + ticketBoughtId +
                   '&username='  + PayAuth.etu.username +
                   '&token='     + PayAuth.etu.token;
            window.open(url, '_blank');
        };
}]);
