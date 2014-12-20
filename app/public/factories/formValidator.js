// Pay - /app/public/factories/formValidator.js

// Form Validator resource

'use strict';

pay.factory('FormValidator', [function () {
    return function (form, imageSelector, imageValidator) {
            // If we end directly the function, all errors may be not thrown
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
            var isFormValid = $('.ng-pristine, .ng-invalid', form).filter(function () {
                return this.value.length === 0;
            }).length === 0;
            if (!isFormValid) {
                var $invalids = $('.ng-pristine, .ng-invalid', form).filter(function () {
                    return this.value.length === 0;
                });
                $invalids.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                formValid = false;
            }

            return formValid;
    };
}]);
