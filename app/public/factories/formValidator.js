////////////////////////////
// Form Validator factory //
////////////////////////////

'use strict';

pay.factory('FormValidator', [function () {
    return function (form, imageSelector, imageValidator) {
            var formValid = true;

            // Image validation
            if (typeof imageValidator !== 'undefined') {
                var $file = form[imageSelector];
                var file = $file.files[0];
                if (!file || (file.type !== 'image/png' && file.type !== 'image/jpeg')) {
                    $($file).parent().parent().next().addClass('ng-invalid');
                    formValid = false;
                } else {
                    $($file).parent().parent().next().removeClass('ng-invalid').addClass('ng-valid');
                }
            }

            // Input validation
            var $invalids = $('.ng-pristine, .ng-invalid', form);
            var emptyForms = $invalids.filter(function () {
                console.log('On a un pristine ou un invalide', this)
                if ($(this).is(':visible') === false) {
                    console.log('Bon ok il était pas visible le coco');
                    return false;
                }
                return this.value.length === 0;
            });
            console.log('Champs problématiques : ', emptyForms);
            if (emptyForms.length !== 0) {
                emptyForms.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                formValid = false;
            }

            return formValid;
    };
}]);
