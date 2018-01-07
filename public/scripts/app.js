(function() {
    angular.module("GlobalApp", ["ngRoute", "MainApp", "EventApp", "Ui"])
        .config(function config($routeProvider)
        {
            $routeProvider
                .when("/", {
                    templateUrl: "app/main.html",
                    controller: "MainController"
                })
                .when("/event", {
                    templateUrl: "app/event.html",
                    controller: "EventController"
                })
                .otherwise({
                    redirectTo: "/"
                });
        })
        .controller("GlobalController", function GlobalController($scope, $route, $location, UiModal)
        {
            $scope.locateToEvent = locateToEvent;

            function locateToEvent() {
                $location.path('/event');
            }
        });
}());

