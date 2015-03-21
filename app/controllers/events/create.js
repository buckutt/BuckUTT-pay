///////////////////
// Event creator //
///////////////////

'use strict';

var fs     = require('fs');
var path   = require('path');
var moment = require('moment');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var form = req.form;

        // Save image to upload/
        var base64Regex = /^data:\w+\/(\w+);base64,([a-zA-Z0-9+\/=]+)$/;
        var matches = form.image.match(base64Regex);

        var ext = matches[1];
        var data = matches[2];

        var buffer = new Buffer(data, 'base64');

        var opath = path.resolve(process.cwd() + '/app/public/static/img/upload');
        var oname = form.name.replace(/\W+/ig, '-') + '.' + ext;
        opath = (opath + '/' + oname.toLowerCase());
        fs.writeFile(opath, buffer, function (err) {
            if (err) {
                return Error.emit(res, 500, '500 - Cannot write file', err.toString());
            }

            var ids = {};
            var currentArticle;

            rest.post('articles', {
                name: form.name,
                type: 'product',
                stock: -1,
                isSingle: false,
                isRemoved: false
            }).then(function (aRes) {
                currentArticle = aRes.data.data;
            }).then(function () {
                return rest.post('articlespoints', {
                    priority: 0,
                    isRemoved: false,
                    ArticleId: currentArticle.id,
                    PointId: 1
                });
            }).then(function () {
                return rest.post('articlespoints', {
                    priority: 0,
                    isRemoved: false,
                    ArticleId: currentArticle.id,
                    PointId: 2
                });
            }).then(function () {
                return rest.post('periods', {
                    name: 'Ventes pay - ' + form.name,
                    startDate: new Date(),
                    endDate: moment(new Date(form.date)).add(1, 'd').toDate(),
                    isRemoved: true,
                    FundationId: form.fundationId
                });
            }).then(function (pReq) {
                req.periodId = pReq.data.data.id;
                return rest.post('prices', {
                    credit: form.priceEtucotPresale * 100,
                    isRemoved: 0,
                    ArticleId: currentArticle.id,
                    FundationId: form.fundationId,
                    GroupId: 1,
                    PeriodId: req.periodId
                });
            }).then(function (prResEtucotPresale) {
                ids.etucotPresale = prResEtucotPresale.data.data.id;
                return rest.post('prices', {
                    credit: form.priceEtucot * 100,
                    isRemoved: 0,
                    ArticleId: currentArticle.id,
                    FundationId: form.fundationId,
                    GroupId: 1,
                    PeriodId: req.periodId
                });
            }).then(function (prResEtucot) {
                ids.etucot = prResEtucot.data.data.id;
                if (form.priceEtuPresaleActive) {
                    return rest.post('prices', {
                        credit: form.priceEtuPresale * 100,
                        isRemoved: 0,
                        ArticleId: currentArticle.id,
                        FundationId: form.fundationId,
                        GroupId: 1,
                        PeriodId: req.periodId
                    });
                }
            }).then(function (prResEtuPresale) {
                if (form.priceEtuPresaleActive) {
                    ids.etuPresale = prResEtuPresale.data.data.id;
                }
                if (form.priceEtuActive) {
                    return rest.post('prices', {
                        credit: form.priceEtu * 100,
                        isRemoved: 0,
                        ArticleId: currentArticle.id,
                        FundationId: form.fundationId,
                        GroupId: 1,
                        PeriodId: req.periodId
                    });
                }
            }).then(function (prResEtu) {
                if (form.priceEtuActive) {
                    ids.etu = prResEtu.data.data.id;
                }
                if (form.priceExtPresaleActive) {
                    return rest.post('prices', {
                        credit: form.priceExtPresale * 100,
                        isRemoved: 0,
                        ArticleId: currentArticle.id,
                        FundationId: form.fundationId,
                        GroupId: 1,
                        PeriodId: req.periodId
                    });
                }
            }).then(function (prResExtPresale) {
                if (form.priceExtPresaleActive) {
                    ids.extPresale = prResExtPresale.data.data.id;
                }
                if (form.priceExtActive) {
                    return rest.post('prices', {
                        credit: form.priceExt * 100,
                        isRemoved: 0,
                        ArticleId: currentArticle.id,
                        FundationId: form.fundationId,
                        GroupId: 1,
                        PeriodId: req.periodId
                    });
                }
            }).then(function (prResExt) {
                if (form.priceExtActive) {
                    ids.ext = prResExt.data.data.id;
                }
            }).catch(function (err) {
                console.dir(err);
                Error.emit(res, 500, '500 - Buckutt server error', 'Create prices');
            }).then(function () {
                return db.Event.create({
                    name: form.name,
                    picture: path.basename(opath),
                    description: form.description,
                    date: new Date(form.date),
                    maximumTickets: form.maximumTickets,
                    opened: false,
                    bdeCard: form.bdeCard,
                    fundationId: form.fundationId,
                    backendId: currentArticle.id
                }).complete(function (err, newEvent) {
                    if (err) {
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            return Error.emit(res, 400, '400 - Duplicate event');
                        }
                        return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                    }

                    // Create first admin account
                    db.Account.create({
                        username: req.user.id,
                        event_id: newEvent.id,
                        right_id: 1
                    });

                    // Create prices
                    // Price Etu cot in presale :
                    db.Price.create({
                        name: form.name + ' - Prix étudiant cotisant en prévente',
                        price: form.priceEtucotPresale,
                        backendId: ids.etucotPresale
                    }).complete(function (err, priceEtucotPresale) {
                        if (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                        }

                        newEvent.addPrice(priceEtucotPresale);
                    });
                    // Price Etu cot not in presale :
                    db.Price.create({
                        name: form.name + ' - Prix étudiant cotisant hors prévente',
                        price: form.priceEtucot,
                        backendId: ids.etucot
                    }).complete(function (err, priceEtucot) {
                        if (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                        }

                        newEvent.addPrice(priceEtucot);
                    });
                    // Price Etu in presale :
                    if (form.priceEtuPresaleActive) {
                        db.Price.create({
                            name: form.name + ' - Prix étudiant non-cotisant en prévente',
                            price: form.priceEtuPresale,
                            backendId: ids.etuPresale
                        }).complete(function (err, priceEtuPresale) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(priceEtuPresale);
                        });
                    }
                    // Price Etu not in presale :
                    if (form.priceEtuActive) {
                        db.Price.create({
                            name: form.name + ' - Prix étudiant non-cotisant hors prévente',
                            price: form.priceEtu,
                            backendId: ids.etu
                        }).complete(function (err, priceEtu) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(priceEtu);
                        });
                    }
                    // Price Ext in presale :
                    if (form.priceExtPresaleActive) {
                        db.Price.create({
                            name: form.name + ' - Prix extérieur en prévente',
                            price: form.priceExtPresale,
                            backendId: ids.extPresale
                        }).complete(function (err, priceExtPresale) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(priceExtPresale);
                        });
                    }
                    // Price Ext not in presale :
                    if (form.priceExtActive) {
                        db.Price.create({
                            name: form.name + ' - Prix extérieur hors prévente',
                            price: form.priceExt,
                            backendId: ids.ext
                        }).complete(function (err, priceExt) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(priceExt);
                        });
                    }
                    // Price Partner in presale :
                    if (form.pricePartnerPresaleActive) {
                        db.Price.create({
                            name: form.name + ' - Prix partenaire en prévente',
                            price: form.pricePartnerPresale,
                            backendId: 0
                        }).complete(function (err, pricePartnerPresale) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(pricePartnerPresale);
                        });
                    }
                    // Price Partner not in presale :
                    if (form.pricePartnerActive) {
                        db.Price.create({
                            name: form.name + ' - Prix partenaire hors prévente',
                            price: form.pricePartner,
                            backendId: 0
                        }).complete(function (err, pricePartner) {
                            if (err) {
                                return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                            }

                            newEvent.addPrice(pricePartner);
                        });
                    }

                    res.json({
                        status: 200,
                        id: newEvent.id
                    });
                    res.end();
                });
            });
        });
    };
};
