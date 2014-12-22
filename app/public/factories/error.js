// Pay - /app/public/factories/error.js

// Error factory

'use strict';

pay.factory('Error', [function () {
    var $modal = $('#modalError');
    var $title = $('#modalErrorTitle');
    var $content = $('#modalErrorText');

    var msgCodes = {
        0:  'Erreur inconnue.',
        1:  'Page introuvable.',
        2:  'Requête invalide ou insuffisante.',
        3:  'Erreur de la base de donnée.',
        4:  'Nom d\'utilisateur ou mot de passe invalide.',
        5:  'Vous ne vous êtes pas authentifié. Redirection dans quelques secondes...',
        6:  'L\'identifiant de l\'événement est incorrect.',
        7:  'L\'événement existe déjà.',
        8:  'Impossible d\'enregistrer l\'image.',
        9:  'L\'événement n\'existe pas.',
        10: 'La session a expirée.',
        11: 'Impossible de générer un nombre aléatoire pour sécuriser le mot de passe.',
        12: 'Impossible de sécuriser votre mot de passe.',
        13: 'Impossible d\'enregistrer la configuration',
        14: 'Erreur d\'authentification',
        15: 'Serveur injoignable'
    };

    return function (title, message, doNotClear) {
        if (!doNotClear) {
            // Clear the storage if this is a token matters
            localStorage.clear();
        }

        $title.text(title);
        $content.text(msgCodes[message]);
        $modal.modal();
    };
}]);
