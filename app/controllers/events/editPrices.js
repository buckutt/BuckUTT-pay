////////////////////////
// Event price editor //
////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var form = req.form;

        // Simplest solution : delete all prices, recreate them all

        var event;
        var backendArticle;
        var periodId;
        var ids = {};
        var toDo = 2;

        db.Event
            .find(req.params.eventId)
            .then(function (event_) {
                event = event_;
                return rest.get('articles/' + event.backendId);
            })
            .then(function (arRes) {
                backendArticle = arRes.data.data;
                // Can't get directly period id (articleid in Prices => PeriodId of price)
                return rest.get('prices?ArticleId=' + backendArticle.id);
            })
            .then(function (prRes) {
                var prices = prRes.data.data;
                periodId = (prices.PeriodId) ? prices.PeriodId : prices[0].PeriodId;
                return rest.delete('prices?ArticleId=' + event.backendId);
            })
            .then(function () {
                // Etu cot presale
                return rest.post('prices', {
                    credit: form.priceEtucotPresale * 100,
                    isRemoved: 0,
                    ArticleId: backendArticle.id,
                    FundationId: event.fundationId,
                    GroupId: 1,
                    PeriodId: periodId
                });
            })
            .then(function (prResEtucotPresale) {
                ids.etucotPresale = prResEtucotPresale.data.data.id;
                return rest.post('prices', {
                    credit: form.priceEtucot * 100,
                    isRemoved: 0,
                    ArticleId: backendArticle.id,
                    FundationId: event.fundationId,
                    GroupId: 1,
                    PeriodId: periodId
                });
            })
            .then(function (prResEtucot) {
                ids.etucot = prResEtucot.data.data.id;
                if (form.priceEtuPresaleActive) {
                    return rest.post('prices', {
                        credit: form.priceEtuPresale * 100,
                        isRemoved: 0,
                        ArticleId: backendArticle.id,
                        FundationId: event.fundationId,
                        GroupId: 1,
                        PeriodId: periodId
                    });
                }
            })
            .then(function (prResEtuPresale) {
                if (form.priceEtuPresaleActive) {
                    ids.etuPresale = prResEtuPresale.data.data.id;
                }
                if (form.priceEtuActive) {
                    return rest.post('prices', {
                        credit: form.priceEtu * 100,
                        isRemoved: 0,
                        ArticleId: backendArticle.id,
                        FundationId: event.fundationId,
                        GroupId: 1,
                        PeriodId: periodId
                    });
                }
            })
            .then(function (prResEtu) {
                if (form.priceEtuActive) {
                    ids.etu = prResEtu.data.data.id;
                }
                if (form.priceExtPresaleActive) {
                    return rest.post('prices', {
                        credit: form.priceExtPresale * 100,
                        isRemoved: 0,
                        ArticleId: backendArticle.id,
                        FundationId: event.fundationId,
                        GroupId: 1,
                        PeriodId: periodId
                    });
                }
            })
            .then(function (prResExtPresale) {
                if (form.priceExtPresaleActive) {
                    ids.extPresale = prResExtPresale.data.data.id;
                }
                if (form.priceExtActive) {
                    return rest.post('prices', {
                        credit: form.priceExt * 100,
                        isRemoved: 0,
                        ArticleId: backendArticle.id,
                        FundationId: event.fundationId,
                        GroupId: 1,
                        PeriodId: periodId
                    });
                }
            })
            .then(function (prResExt) {
                if (form.priceExtActive) {
                    ids.ext = prResExt.data.data.id;
                }

                return db.Price
                            .destroy({
                                where: {
                                    event_id: event.id
                                }
                            });
            })
            .then(function () {
                db.Price
                    .create({
                        name: event.name + ' - Prix étudiant cotisant en prévente',
                        price: form.priceEtucotPresale,
                        backendId: ids.etucotPresale
                    })
                    .then(function (priceEtucotPresale) {
                        checkToDo();
                        event.addPrice(priceEtucotPresale);
                    })
                    .catch(function (err) {
                        return Error.emit(null, 500, '500 - SQL Server error', err);
                    });
                // Price Etu cot not in presale :
                db.Price
                    .create({
                        name: event.name + ' - Prix étudiant cotisant hors prévente',
                        price: form.priceEtucot,
                        backendId: ids.etucot
                    })
                    .then(function (priceEtucot) {
                            checkToDo();
                        event.addPrice(priceEtucot);
                    })
                    .catch(function (err) {
                        return Error.emit(null, 500, '500 - SQL Server error', err);
                    });
                // Price Etu in presale :
                if (form.priceEtuPresaleActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix étudiant non-cotisant en prévente',
                            price: form.priceEtuPresale,
                            backendId: ids.etuPresale
                        })
                        .then(function (priceEtuPresale) {
                            checkToDo();
                            event.addPrice(priceEtuPresale);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
                // Price Etu not in presale :
                if (form.priceEtuActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix étudiant non-cotisant hors prévente',
                            price: form.priceEtu,
                            backendId: ids.etu
                        })
                        .then(function (priceEtu) {
                            checkToDo();
                            event.addPrice(priceEtu);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
                // Price Ext in presale :
                if (form.priceExtPresaleActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix extérieur en prévente',
                            price: form.priceExtPresale,
                            backendId: ids.extPresale
                        })
                        .then(function (priceExtPresale) {
                            checkToDo();
                            event.addPrice(priceExtPresale);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
                // Price Ext not in presale :
                if (form.priceExtActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix extérieur hors prévente',
                            price: form.priceExt,
                            backendId: ids.ext
                        })
                        .then(function (priceExt) {
                            checkToDo();
                            event.addPrice(priceExt);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
                // Price Partner in presale :
                if (form.pricePartnerPresaleActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix partenaire en prévente',
                            price: form.pricePartnerPresale,
                            backendId: 0
                        })
                        .then(function (pricePartnerPresale) {
                            checkToDo();
                            event.addPrice(pricePartnerPresale);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
                // Price Partner not in presale :
                if (form.pricePartnerActive) {
                    toDo++;
                    db.Price
                        .create({
                            name: event.name + ' - Prix partenaire hors prévente',
                            price: form.pricePartner,
                            backendId: 0
                        })
                        .then(function (pricePartner) {
                            checkToDo();
                            event.addPrice(pricePartner);
                        })
                        .catch(function (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err);
                        });
                }
            })
            .catch(function (err) {
                Error.emit(res, 500, '500 - SQL Server Error', err);
            });

        function checkToDo () {
            toDo--;
            if (toDo === 0) {
                return res
                        .status(200)
                        .end();
            }
        }
    };
};
