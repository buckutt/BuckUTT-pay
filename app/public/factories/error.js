// Pay - /app/public/factories/error.js

// Error resource

'use strict';

pay.factory('Error', [function () {
    var $modal = $('#modalError');
    var $title = $('#modalErrorTitle');
    var $content = $('#modalErrorText');


    var msgCodes = {
        0: 'Erreur 500 - Erreur inconnue.',
        1: 'Erreur 500 - Le site etu ne répond pas.',
        2: 'Erreur 400 - Requête invalide.',
        3: 'Erreur 500 - Erreur de la base de donnée.'
    };

    return function (title, message) {
        $title.text(title);
        $content.text(msgCodes[message]);
        $modal.modal();
    };
}]);