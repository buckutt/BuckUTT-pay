// Pay - /app/controllers/events/create.js

// Tickets creator

'use strict';

var fs   = require('fs');
var path = require('path');
var moment = require('moment');

module.exports = function (db) {
    return function (req, res) {
        var newEvent = req.body;

        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request');
            return;
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
        opath = (opath + '/' + oname).toLowerCase();
        fs.writeFile(opath, buffer, function (err) {
            if (err) {
                console.log(err);
            }

            console.log(form.date);
    
            db.Event.create({
                name: form.name,
                picture: path.basename(opath),
                description: form.description,
                date: new Date(form.date),
                maximumTickets: form.maximumTickets
            }).complete(function (err, gala2015) {
                if (err) {
                    Error.emit(null, 500, '500 - SQL Server error ', err.toString());
                }

                res.json({
                    status: 1,
                    id: gala2015.id
                });
                res.end();
            });
        });
    };
};
