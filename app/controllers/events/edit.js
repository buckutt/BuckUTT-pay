// Pay - /app/controllers/events/edit.js

// Tickets editor

'use strict';

var fs   = require('fs');
var path = require('path');
var moment = require('moment');

module.exports = function (db) {
    return function (req, res) {
        var newEvent = req.body;

        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        var form = req.form;
        var hasImage = form.image.length > 0;

        if (hasImage) {
            // Save image to upload/
            var base64Regex = /^data:\w+\/(\w+);base64,([a-zA-Z0-9+\/=]+)$/;
            var matches = form.image.match(base64Regex);
        
            var ext = matches[1];
            var data = matches[2];
        
            var buffer = new Buffer(data, 'base64');

            var opath = path.resolve(process.cwd() + '/app/public/static/img/upload');
            var oname = form.name.replace(/\W+/ig, '-') + '.' + ext;
            opath = (opath + '/' + oname).toLowerCase();

            fs.writeFile(opath, buffer, callback);
        } else {
            callback();
        }

        function callback (err) {
            if (err) {
                Error.emit(res, 500, '500 - Cannot write file', err.toString());
            }

            db.Event.find(form.id).complete(function (err, event) {
                if (err) {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        Error.emit(res, 400, '400 - Duplicate event');
                        return;
                    }
                    Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                delete form.id;
                Object.keys(form).forEach(function (k) {
                    event[k] = form[k];
                });

                event.save().complete(function (err) {
                    if (err) {
                        Error.emit(res, 500, '500 - SQL Server error', err.toString());
                        return;
                    }
                    res.json({
                        status: 200
                    });
                });
            });
        }
    };
};
