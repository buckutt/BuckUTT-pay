//////////////////////////////
// Euro currency formatting //
//////////////////////////////

pay.filter('euro', ['$filter', function ($filter) {
    return function (input, precision) {
        if (!input) {
            input = 0;
        }

        if (!input.toFixed) {
            input = parseFloat(input);
        }

        if (!input) {
            input = 0;
        }

        input = input.toFixed(precision || 2);
        // Base formatting
        input = $filter('currency')(input, '€', precision || 2);
        // Handles "(€XX.XX)" (ie. negative sold)
        input = input.replace(/^\(€(.*)\)$/i, '-$1€');
        // Handles "€XX.XX" (ie. positive sold)
        input = input.replace(/^€(.*)$/i, '$1€');

        return input;
    };
}]);
