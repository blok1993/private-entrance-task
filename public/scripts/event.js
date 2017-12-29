(function() {
    angular.module("EventApp", ["Ui", "ngSanitize", "ngAnimate", "ui.bootstrap", "ui.mask"])
        .controller("EventController", function EventController($scope, $rootScope, UiModal, $location)
        {
            $rootScope.showCreateButton = false;
            $scope.q = {};

            $scope.clearTopic = clearTopic;
            $scope.clearParticipantName = clearParticipantName;
            $scope.today = today;
            $scope.openEventCalendar = openEventCalendar;
            $scope.setDate = setDate;
            $scope.calMove = calMove;
            $scope.removeEvent = removeEvent;
            $scope.closeEventForm = closeEventForm;

            function clearTopic() {
                $scope.q.topic = '';
            }

            function clearParticipantName() {
                $scope.q.participantName = '';
            }

            function removeEvent() {
                UiModal.question("Встреча будет \n удалена безвозвратно", "", "Удалить", "Отмена");
            }

            function closeEventForm() {
                $location.path('/');
            }

            //Calendar
            $scope.popupCalendar = {
                opened: false
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                minDate: new Date(),
                startingDay: 1,
                showWeeks: false,
                maxMode: 'day'
            };

            $scope.formats = ['dd MMMM, yyyy'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            function openEventCalendar() {
                $scope.popupCalendar.opened = true;
            }

            function setDate(year, month, day) {
                $scope.date = new Date(year, month, day);
            }

            function today() {
                $scope.date = new Date();
            }

            today();

            function calMove(a) {
                var currentDate = new Date($scope.date);
                currentDate.setDate(currentDate.getDate() + a);
                $scope.date = new Date(currentDate);
            }
        });
}());