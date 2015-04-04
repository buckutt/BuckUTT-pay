///////////////////////////////////////////
// Factory to parse prices from database //
///////////////////////////////////////////

'use strict';

pay.factory('ParsePrices', [
    '$timeout',
    '$http',
    'Error',
    function ($timeout, $http, Error) {
        function ParsePrices () {
            /**
             * Parses prices from an event object
             * @param {object} e Event object
             */
            this.fromEvent = function (e) {
                var name = e.name;
                var prices = e.Prices;
                var $prices = $('.prices label');
                var existingPrices = [
                    'Prix étudiant cotisant en prévente',
                    'Prix étudiant cotisant hors prévente',
                    'Prix étudiant non-cotisant en prévente',
                    'Prix étudiant non-cotisant hors prévente',
                    'Prix extérieur en prévente',
                    'Prix extérieur hors prévente'
                ];

                if (typeof prices !== 'object') {
                    return;
                }

                prices.forEach(function (price) {
                    var nameSplitted = price.name.split(name + ' - ');

                    if (typeof nameSplitted[1] === 'undefined') {
                        return;
                    }

                    var priceName = nameSplitted[1].trim();
                    var indexPrice = existingPrices.indexOf(priceName);

                    if (indexPrice === -1) {
                        return;
                    }

                    var $target = $prices.eq(indexPrice).children();
                    $target.first().prop('checked', true);
                    $target.last().val(price.price);
                    $timeout(function () {
                        if (!$target.last().data().$ngModelController) {
                            return;
                        }
                        $target.last().data().$ngModelController.$setViewValue($target.last().val());
                    });
                });
            };

            /**
             * Updates an event given a price object
             * @param {object}   e        Event object
             * @param {object}   prices   Price object
             * @param {Function} callback Callback
             */
            this.toEvent = function (e, prices, callback) {
                console.log(e);
                console.log(prices);

                var assoc = {
                    priceEtuPresaleActive:     'priceEtuPresale',
                    priceEtuActive:            'priceEtu',
                    priceExtPresaleActive:     'priceExtPresale',
                    priceExtActive:            'priceExt',
                    pricePartnerPresaleActive: 'pricePartnerPresale',
                    pricePartnerActive:        'pricePartner'
                };

                Object.keys(prices).forEach(function (price) {
                    if (assoc.hasOwnProperty(price)) {
                        if (!prices.hasOwnProperty(assoc[price])) {
                            delete prices[price];
                        }
                    }
                });

                $http.post('api/events/' + e.id + '/prices', prices).then(callback, callback);
            }
        }

        return new ParsePrices();
    }
]);
