angular.module('angular-round-slider', []).directive('roundSlider', function () {
    return {
        restrict: 'AEC',
        replace: true,
        template: '',
        scope: {
            options: '='
        },
        link: function (scope, elem, attrs) {
            elem.roundSlider(scope.options);
            elem.bind('drag', function () {
                scope.$apply(function () {
                    scope.options.value = elem.data("roundSlider").getValue();
                });
            });
        }
    };
});
