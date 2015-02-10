//////////////////
// Mail library //
//////////////////

'use strict';

var fs            = require('fs');
var nodemailer    = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (config) {
    var transporter = nodemailer.createTransport(smtpTransport(config.mail.config));

    /**
     * Sends places to the dest
     * @param  {string} dest    Dest e-mail
     * @param  {string} subject Mail subject
     * @param  {object} places  Places object like "name:link"
     */
    function mailPlaces (dest, subject, places) {
        var baseMail = fs.readFileSync('./app/public/mail.html', { encoding: 'utf8' });
        var content = objectToLis(places);
        var finalMail = baseMail.replace('{{places}}', content);

        var mailOptions = {
            from: config.mail.sender,
            to: dest,
            subject: 'Places Buckutt',
            text: objectToText(places),
            html: finalMail
        };

        transporter.sendMail(mailOptions, function (err, infos) {
            if (err) {
                console.log('ERROR MAIL');
                console.log(err);
            } else {
                console.log('SENT');
                console.log(infos.response);
            }
        });
    }

    function mailPasswordResetter (dest, link) {
        var baseMail = fs.readFileSync('./app/public/mail.html', { encoding: 'utf8' });
        var content = objectToLis(places);
        var finalMail = baseMail.replace('{{places}}', content);

        var mailOptions = {
            from: config.mail.sender,
            to: dest,
            subject: 'Places Buckutt',
            text: objectToText(places),
            html: finalMail
        };

        transporter.sendMail(mailOptions, function (err, infos) {
            if (err) {
                console.log('ERROR MAIL');
                console.log(err);
            } else {
                console.log('SENT');
                console.log(infos.response);
            }
        });
    }

    /**
     * Converts places to multiple <li>
     * @param  {object} places Places object like "name:link"
     * @return {string}        Formatted HTML
     */
    function objectToLis (places) {
        var keys = Object.keys(places);
        var lis = '';
        for (var i = keys.length - 1; i >= 0; i--) {
            var placeTitle = keys[i];
            var link = places[keys[i]];

            var li = '<li style="Margin-top: 0;padding-left: 3px">';
            li += placeTitle;
            li += ' <a href="' + link + '">Téléchargement</a>';
            li += '</li>';

            lis += li;
        }

        return lis;
    }

    /**
     * Converts places to text
     * @param  {object} places Places object like "name:link"
     * @return {string}        Formatted text
     */
    function objectToText (places) {
        var keys = Object.keys(places);
        var text = '';
        for (var i = keys.length - 1; i >= 0; i--) {
            var placeTitle = keys[i];
            var link = places[keys[i]];

            text += '* ' + placeTitle + ' : ' + link + '\n';
        }

        return text;
    }

    return {
        places: mailPlaces
    };
};
