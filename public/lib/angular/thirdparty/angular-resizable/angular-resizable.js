angular.module('angular-resizable', []).directive('resizable', function () {
    return {
        restrict: 'A',
        scope: {
            callback: '&onResize'
        },
        link: function postLink(scope, elem, attrs) {
            var container = elem.hasClass('task') ? '.block-for-map-and-camera' : '.map-area';
            var maxHeight = $(container).height();
            elem.resizable({
                handles: "all",
                aspectRatio: true,
                containment: container,
                maxHeight: maxHeight,
                maxWidth: maxHeight*1.25,
                minHeight: 300,
                minWidth: 380
            });
            elem.on('resizestop', function (evt, ui) {
                if (scope.callback) { scope.callback(); }
            });
        }
    };
});