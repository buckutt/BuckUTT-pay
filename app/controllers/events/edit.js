//////////////////
// Event editor //
//////////////////

'use strict';

var fs     = require('fs');
var path   = require('path');
var moment = require('moment');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    /**
     * Gets the file extension
     * @param  {string} filename The file name
     * @return {string}          The file extension
     */
    function getExtension (filename) {
        var ext = path.extname(filename || '').split('.');
        return (ext.length === 0) ? '' : ext[ext.length - 1];
    }

    return function (req, res) {
        if (!req.form.isValid) {
            return Error.emit(res, 400, '400 - Bad Request', req.form.errors);
        }

        var form = req.form;
        var hasImage = form.image.length > 0;
        var opath = path.resolve(process.cwd() + '/app/public/static/img/upload');

        if (hasImage) {
            // Save image to upload/
            var base64Regex = /^data:\w+\/(\w+);base64,([a-zA-Z0-9+\/=]+)$/;
            var matches = form.image.match(base64Regex);

            var data = matches[2];

            // var ext = matches[1];
            // var oname = form.name.replace(/\W+/ig, '-') + '.' + ext;
            // var realOPath = (opath + '/' + oname).toLowerCase();

            var buffer = new Buffer(data, 'base64');
            fs.writeFile(opath, buffer, callback);
        } else {
            callback();
        }

        function callback (err) {
            if (err) {
                return Error.emit(res, 500, '500 - Cannot write file', err.toString());
            }

            db.Event
                .find(form.id)
                .then(function (event) {
                    var picturePath = path.resolve(process.cwd() + '/app/public/static/img/upload') + '/' + event.picture;
                    var newPicturePath = opath + '/' +
                                         form.name.toLowerCase().replace(/\W+/ig, '-') + '.' +
                                         getExtension(event.picture);

                    if (event.name !== form.name) {
                        if (hasImage) {
                            logger.info('Deleting picture file ' + picturePath);
                            fs.unlink(picturePath);
                        } else {
                            logger.info('Moving file ' + picturePath + ' to ' + newPicturePath);
                            fs.rename(picturePath, newPicturePath);
                        }
                    }

                    delete form.id;
                    Object.keys(form).forEach(function (k) {
                        event[k] = form[k];
                    });

                    var savedEvent;
                    event
                        .save()
                        .then(function (sEvent) {
                            savedEvent = sEvent;
                            // Update article name in back-end
                            return rest.put('articles/' + savedEvent.backendId, {
                                name: savedEvent.name
                            });
                        }, function (err) {
                            return Error.emit(res, 500, '500 - SQL Server error', err);
                        })
                        .then(function () {
                            // Can't get directly period id (articleid in Prices => PeriodId of price)
                            var articleId = savedEvent.backendId;
                            return rest.get('prices?ArticleId=' + articleId);
                        })
                        .then(function (prRes) {
                            var prices = prRes.data.data;
                            // Take the first price to get the PeriodId (unique periodid for all prices)
                            return rest.put('periods/' + prices[0].PeriodId, {
                                name: 'Ventes pay - ' + savedEvent.name,
                                endDate: moment(new Date(savedEvent.date)).add(1, 'd').toDate(),
                                isRemoved: !savedEvent.opened
                            });
                        })
                        .then(function () {
                            return res
                                    .status(200)
                                    .end();
                        })
                        .catch(function (err) {
                            return Error.emit(res, 500, '500 - Buckutt server error', err);
                        });
                })
                .catch(function (err) {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        return Error.emit(res, 400, '400 - Duplicate event');
                    }
                    return Error.emit(null, 500, '500 - SQL Server error', err);
                });
        }
    };
};
