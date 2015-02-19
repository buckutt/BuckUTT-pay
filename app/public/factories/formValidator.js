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
                var $self = $(this);
                if ($self.is(':visible') === false || $self.attr('useless-validation') !== undefined) {
                    return false;
                }
                return this.value.length === 0;
            });
            if (emptyForms.length !== 0) {
                emptyForms.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                formValid = false;
            }

            return formValid;
    };
}]);
