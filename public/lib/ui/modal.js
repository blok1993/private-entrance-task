(function () {
    angular.module("Ui", ["ngAnimate", "ui.bootstrap"])
        .factory("UiModal", UiModal);

    UiModal.$inject = ["$uibModal", "$rootScope"];

    function UiModal($uibModal, $rootScope) {
        return {
            info: info,
            question: question,
            show: show
        };

        function info(title, message, buttonName) {
            message = message.replace(/<br\s*[\/]?>/gi, "\n");
            buttonName = buttonName || "Закрыть";

            return show(
                {
                    title: title, message: message, buttonName: buttonName
                }, {
                    templateUrl: "lib/ui/view/info.html"
                }).result;
        }

        function question(title, message, buttonYes, buttonNo) {
            message = message.replace(/<br\s*[\/]?>/gi, "\n");
            buttonYes = buttonYes || "Да";
            buttonNo = buttonNo || "Нет";

            return show(
                {
                    title: title, message: message, buttonYes: buttonYes, buttonNo: buttonNo
                }, {
                    templateUrl: "lib/ui/view/question.html"
                }).result;
        }

        function show(params, options) {
            var modalScope = $rootScope.$new();

            var modalOptions = {
                backdrop: false,
                scope: angular.extend(modalScope, params || {}),
                windowTemplateUrl: 'lib/ui/view/backdrop.html'
            };

            return $uibModal.open(angular.extend(modalOptions, options || {}));
        }
    }
})();
