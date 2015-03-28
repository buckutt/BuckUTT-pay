////////////////////////////
// Main reload controller //
////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    return function (req, res) {
        restling.post(config.sherlocks.host + (req.query.amount * 100), {
            data: req.user.mail,
            name: config.sherlocks.reloadId
        })
        .then(function (sherlocksRes) {
            return new Promise(function (resolve, reject) {
                db.Token.create({
                    usermail: req.user.mail,
                    sherlocksToken: sherlocksRes.data.id
                }).complete(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(sherlocksRes);
                });
            });
        })
        .then(function (sherlocksRes) {
            res.status(200).json(sherlocksRes.data).end();
        });

        // var sherlocksRes = {
        //     res: {},
        //     data: {
        //         id: '...',
        //         form: '<FORM METHOD=POST ACTION="https://sherlocks.lcl.fr/cgis-payment-sherlocks/prod/callpayment" target="_top"><INPUT TYPE=HIDDEN NAME=DATA VALUE="2020343135603028502c2360542c3334532d2360512e3360502c3360502c2331302d4324575c224360542c3360502c2340522c2324502c2330522d5048502c2328502c2324552c2330542e232c582d4338572c4360502c2324595c224360522e3360502c2329463c4048502c232c502c2360532c3360515c224360502d3360502c2338512d432c522d23402a2c2360562c2360512d2328502c3334502c5328542c3334532c4330585c224360502e2360502c232c592d53402a2c2328582c2360502c4639525c224360502e3360502c2329463c4048502c3324502c2330553a2731543c23484f2b56295538564c4e3d3731542b4639522b572d483937294c3b562d4b3c525d433836514c384625433a572c4f3c4635543d37294e5c224360532c3360502d2339483d2731502e425c4f384735433a5259553d27304e3947284f3c5641453c46514f38564d532b562d413b26514238362d4b3c525d433b5659463a37294d5c224360512c5360502d2335483d2731502e425c4f384735433a5259553d27304e3947284f3c5641453c46514f38564d532b562d413b26514238362d4b3c525d43383659433936502a2c2324562c2360502c552d33336048502c333c502c23605639463946394639465c224360512e2360502c2338502c2360502c23602a2c2324592c2360512d372d483937294c3b562d4b3c532d462b463d49394048502c4360502c236057384631452b47214e395048502c5338502c2324583054284c354445333032512d30352d3431352923303529245c2240606014e0759ab0348bda"><DIV ALIGN=center>Vous utilisez le formulaire s&#233;curis&#233; standard SSL, choisissez une carte ci-dessous  <IMG BORDER=0 SRC="/static/img/CLEF.gif"> :<br><br></DIV><DIV ALIGN=center><INPUT TYPE=IMAGE NAME=CB BORDER=0 SRC="/static/img/CB.gif"><IMG SRC="/static/img/INTERVAL.gif"><INPUT TYPE=IMAGE NAME=VISA BORDER=0 SRC="/static/img/VISA.gif"><IMG SRC="/static/img/INTERVAL.gif"><INPUT TYPE=IMAGE NAME=MASTERCARD BORDER=0 SRC="/static/img/MASTERCARD.gif"><br><br></DIV></FORM>'
        //     }
        // };

        // new Promise(function (resolve, reject) {
        //     db.Token.create({
        //         usermail: req.user.mail,
        //         sherlocksToken: sherlocksRes.data.id
        //     }).complete(function (err) {
        //         if (err) {
        //             return reject(err);
        //         }

        //         resolve(sherlocksRes);
        //     });
        // })
        // .then(function (sherlocksRes) {
        //     res.status(200).json(sherlocksRes.data).end();
        // });
    };
};