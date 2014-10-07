// Pay - /app/controllers/events/create.js

// Tickets creator

'use strict';


var fs   = require('fs');
var path = require('path');

module.exports = function (db) {
    return function (req, res) {
        var newEvent = req.body;

        // Save image to upload/
        var base64Regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = newEvent.image.match(base64Regex);
        
        var ext = matches[1];
        var data = matches[2];
        
        var buffer = new Buffer(data, 'base64');

        var opath = path.resolve(process.cwd() + '/app/public/static/img/upload');
        var oname = newEvent.name.replace(/\W+/ig, '-') + '.' + ext;
        opath = (opath + '/' + oname).toLowerCase();
        fs.writeFile(opath, buffer, function (err) {
            if (err) {
                console.log(err);
            }
    
            db.Event.create({
                name: newEvent.name,
                picture: path.basename(opath),
                description: newEvent.description,
                date: new Date(newEvent.date)
            });

            res.end('ok');
        });
    };
};
