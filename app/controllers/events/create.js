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

        var classicError = function () {
            Error.emit(res, 500, '500 - Buckutt server error', this);
        };

        var opath = path.resolve(process.cwd() + '/app/public/static/img/upload');
        var oname = form.name.replace(/\W+/ig, '-') + '.' + ext;
        opath = (opath + '/' + oname.toLowerCase());
        fs.writeFile(opath, buffer, function (err) {
            if (err) {
                return Error.emit(res, 500, '500 - Cannot write file', err.toString());
            }

            rest.post('articles', {
                name: form.name,
                type: 'product',
                stock: -1,
                isSingle: false,
                isRemoved: false,
                FundationId: form.fundationId
            }).then(function (aRes) {
                console.log(aRes.data);
                req.currentArticle = aRes.data.data;
            }).then(function () {
                console.log(req.currentArticle);
                return rest.post('articlespoints', {
                    priority: 0,
                    isRemoved: false,
                    ArticleId: req.currentArticle.id,
                    PointId: 1
                });
            }).then(function () {
                return rest.post('articlespoints', {
                    priority: 0,
                    isRemoved: false,
                    ArticleId: req.currentArticle.id,
                    PointId: 1
                });
            }).then(function () {
                return rest.post('periods', {
                    name: 'Ventes pay - ' + form.name,
                    startDate: new Date(),
                    endDate: moment(new Date(form.date)).add(1, 'd').toDate(),
                    isRemoved: true,
                    FundationId: form.fundationId
                });
            }).then(function () {
                return rest.post('prices', {
                    credit: form.priceEtuCottPresale,
                    isRemoved: 0,
                    ArticleId: req.currentArticle.id,
                    GroupId: 1
                });
            }).then(function () {
                return rest.post('prices', {
                    credit: form.priceEtuCott,
                    isRemoved: 0,
                    ArticleId: req.currentArticle.id,
                    GroupId: 1
                });
            }).then(function () {
                if (form.priceEtuPresaleActive) {
                    return rest.post('prices', {
                        credit: form.priceEtuPresale,
                        isRemoved: 0,
                        ArticleId: req.currentArticle.id,
                        GroupId: 5
                    });
                }
            }).then(function () {
                if (form.priceEtuActive) {
                    return rest.post('prices', {
                        credit: form.priceEtu,
                        isRemoved: 0, ArticleId: req.currentArticle.id, GroupId: 5
                    });
                }
            }).catch(function (err) {
                Error.emit(null, 500, '500 - SQL Server error', err.toString());
            }).then(function () {
                return db.Event.create({
                    name: form.name,
                    picture: path.basename(opath),
                    description: form.description,
                    date: new Date(form.date),
                    maximumTickets: form.maximumTickets,
                    opened: false,
                    fundationId: form.fundationId,
                    backendId: req.currentArticle.id
                }).complete(function (err, newEvent) {
                    if (err) {
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            return Error.emit(res, 400, '400 - Duplicate event');
                        }
                        console.dir(err);
                        return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                    }

                    // Create first admin account
                    db.Account.create({
                        username: req.user.id
                    }).complete(function (err, adminUser) {
                        adminUser.setRight(1);
                        adminUser.setEvent(newEvent.id);
                    });

                    // Create prices
                    // Price Etu cott in presale :
                    db.Price.create({
                        name: form.name + ' - Prix étudiant cottisant en prévente',
                        price: form.priceEtuCottPresale
                    }).complete(function (err, priceEtuCottPresale) {
                        if (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                        }

                        newEvent.addPrice(priceEtuCottPresale);
                    });
                    // Price Etu cott not in presale :
                    db.Price.create({
                        name: form.name + ' - Prix étudiant cottisant hors prévente',
                        price: form.priceEtuCott
                    }).complete(function (err, priceEtuCott) {
                        if (err) {
                            return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                        }

                        newEvent.addPrice(priceEtuCott);
                    });
                    // Price Etu in presale :
                    if (form.priceEtuPresaleActive) {
                        db.Price.create({
                            name: form.name + ' - Prix étudiant non-cottisant en prévente',
                            price: form.priceEtuPresale
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
                            name: form.name + ' - Prix étudiant non-cottisant hors prévente',
                            price: form.priceEtu
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
                            price: form.priceExtPresale
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
                            price: form.priceExt
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
                            price: form.pricePartnerPresale
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
                            price: form.pricePartner
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
