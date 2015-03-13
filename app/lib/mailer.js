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
     * @param {string} dest    Dest e-mail
     * @param {object} places  Places object like "name:link"
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
            html: finalMail,
            attachments: placesToAttachements(places)
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
     * @param {string} dest The user mail
     * @param {string} link The password reset link
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
     * Sends the mail with the token to check mail integrity
     * @param {string} dest  The user mail
     * @param {string} token The mail token
     */
    function mailToken (dest, token, cb) {
        var baseMail = fs.readFileSync('./app/public/mail.token.html', { encoding: 'utf8' });
        var finalMail = baseMail.replace('{{code}}', token);

        var textMail = 'Voici votre code pour valider l\'achat sur Buckutt : ' + token;

        var mailOptions = {
            from: config.mail.sender,
            to: dest,
            subject: 'Validation du mail pour l\'achat Buckutt',
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
     * @param  {object} places Places object like "name:buffer"
     * @return {string}        Formatted HTML
     */
    function objectToLis (places) {
        return Object.keys(places)
            .map(function (name) {
                return '<li style="Margin-top: 0;padding-left: 3px">' + name + '</li>';
            })
            .join('');
    }

    /**
     * Converts places to text
     * @param  {object} places Places object like "name:buffer"
     * @return {string}        Formatted text
     */
    function objectToText (places) {
        return Object.keys(places)
            .map(function (name) {
                return '* ' + name;
            })
            .join('\n');
    }

    /**
     * Converts places to attachements
     * @param  {object} places Places object like "name:buffer"
     * @return {array}         Attachements array
     */
    function placesToAttachements (places) {
        var attachements = [];
        Object.keys(places).forEach(function (placeName) {
            attachements.push({
                filename: placeName + '.pdf',
                content: places[placeName]
            });
        });

        return attachements;
    }

    return {
        places: mailPlaces,
        reset: mailPasswordResetter,
        mailToken: mailToken
    };
};
