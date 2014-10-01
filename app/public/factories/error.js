// Pay - /app/public/factories/error.js

// Error resource

'use strict';

pay.factory('Error', [function () {
    var $modal = $('#modalError');
    var $title = $('#modalErrorTitle');
    var $content = $('#modalErrorText');
    return function (title, message) {
        $title.text(title);
        $content.text(message);
        $modal.modal();
    };
}]);