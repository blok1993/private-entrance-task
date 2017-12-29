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
        .controller("GlobalController", function GlobalController($scope, $route, UiModal)
        {
            $scope.openModal = openModal;

            function openModal() {
                UiModal.info("Встреча создана!", "14 декабря, 15:00 - 17:00 \n Готем&nbsp;·&nbsp;4 этаж", "Хорошо");
            }


        });
}());

