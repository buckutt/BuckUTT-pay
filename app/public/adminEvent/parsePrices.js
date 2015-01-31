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
            this.fromEvent = function (e) {
                var name = e.name;
                var prices = e.Prices;
                var $prices = $('.prices label');
                var existingPrices = [
                    'Prix étudiant cottisant en prévente',
                    'Prix étudiant cottisant hors prévente',
                    'Prix étudiant non-cottisant en prévente',
                    'Prix étudiant non-cottisant hors prévente',
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
                    }, 0);
                });
            };

            this.toEvent = function (e, prices) {
                var name = e.name;
                var existingPrices = {
                    priceEtuCottPresale: 'Prix étudiant cottisant en prévente',
                    priceEtuCott:        'Prix étudiant cottisant hors prévente',
                    priceEtuPresale:     'Prix étudiant non-cottisant en prévente',
                    priceEtu:            'Prix étudiant non-cottisant hors prévente',
                    priceExtPresale:     'Prix extérieur en prévente',
                    priceExt:            'Prix extérieur hors prévente'
                }

                Object.keys(prices).forEach(function (price, i) {
                    // Given price must exist
                    if (!existingPrices.hasOwnProperty(price)) {
                        return;
                    }

                    // The event should have it or create it
                    if (typeof e.Prices[i] === 'undefined') {
                        $http.put('api/events/' + e.id + '/prices', {
                            name: e.name + ' - ' + existingPrices[price],
                            price: prices[price]
                        }).success(function () {

                        }).error(function (res) {
                            Error('Erreur', res.error);
                        });
                        return;
                    }

                    // The events should have the same name
                    if (e.Prices[i].name !== name + ' - ' + existingPrices[price]) {
                        return;
                    }

                    // Update the price
                    e.Prices[i].price = prices[price];
                    $http.post('api/events/' + e.id + '/prices/' + e.Prices[i].id, {
                        price: e.Prices[i].price
                    }).success(function () {
                    }).error(function (res) {
                        Error('Erreur', res.error);
                    });
                });
            }
        }

        return new ParsePrices();
    }
]);
