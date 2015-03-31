///////////////////////
// Report CSP errors //
///////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        var body = JSON.parse(req.rawBody);

        if (!body.hasOwnProperty('csp-report')) {
            return res
                    .status(400)
                    .end();
        }

        var cspReport = body['csp-report'];

        if (!cspReport.hasOwnProperty('document-uri') ||
            !cspReport.hasOwnProperty('violated-directive')) {
            return res
                    .status(400)
                    .end();
        }

        logger.error('[CSP report] Document : "' + cspReport['document-uri'] + '"' +
                                 ' Directive : "' + cspReport['violated-directive'] + '"');

        return res
                .status(200)
                .end();
    };
};