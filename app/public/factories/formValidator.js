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

                if ($self.attr('type') === 'checkbox') {
                    return false;
                }

                return !$self.hasClass('ng-valid');
            });

            if (emptyForms.length !== 0) {
                emptyForms.removeClass('ng-pristine ng-valid').addClass('ng-invalid');
                emptyForms.each(function () {
                    var $self = $(this);
                    if ($self.parent().hasClass('input-group')) {
                        $self.parent().addClass('has-error');
                    }
                });
                formValid = false;
            }

            return formValid;
    };
}]);
