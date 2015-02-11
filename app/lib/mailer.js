//////////////////
// Mail library //
//////////////////

'use strict';

var fs            = require('fs');
var nodemailer    = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (config) {
    var logger = require('./log')(config);
    var transporter = nodemailer.createTransport(smtpTransport(config.mail.config));

    /**
     * Sends places to the dest
     * @param  {string} dest    Dest e-mail
     * @param  {object} places  Places object like "name:link"
     */
    function mailPlaces (dest, places, cb) {
        var baseMail = fs.readFileSync('./app/public/mail.places.html', { encoding: 'utf8' });
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
                logger.error(err);
                return cb(false);
            }
            logger.debug('Mail sent with success');
            cb ? cb(true) : 0;
        });
    }

    /**
     * Sends the mail with the password reset link
     * @param  {string} dest The user mail
     * @param  {string} link The password reset link
     */
    function mailPasswordResetter (dest, link, cb) {
        var baseMail = fs.readFileSync('./app/public/mail.reset.html', { encoding: 'utf8' });
        var finalMail = baseMail.replace('{{link}}', link)
                                .replace('{{linkText}}', link);

        var textMail = 'Voici le lien pour changer votre mot de passe Buckutt : ' + link;

        var mailOptions = {
            from: config.mail.sender,
            to: dest,
            subject: 'Changement de mot de passe Buckutt',
            text: textMail,
            html: finalMail
        };

        transporter.sendMail(mailOptions, function (err, infos) {
            if (err) {
                logger.error(err);
                return cb(false);
            }
            logger.debug('Mail sent with success');
            cb ? cb(true) : 0;
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

            text += '* ' + placeTitle + '\n';
        }

        return text;
    }

    return {
        places: mailPlaces,
        reset: mailPasswordResetter
    };
};
