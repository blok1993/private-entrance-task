(function() {
    angular.module("EventApp", ["Ui", "ngSanitize", "ngAnimate", "ui.bootstrap", "ui.mask", "ui.select"])
        .controller("EventController", function EventController($scope, $rootScope, UiModal, $location)
        {
            $rootScope.showCreateButton = false;
            $scope.q = {};
            $scope.person = {};
            $scope.isNewEvent = true;

            $scope.people = [
                {name: "Лекс Лютер", floor: 1},
                {name: "Томас Андерсон", floor: 2},
                {name: "Брэд Пит", floor: 4},
                {name: "Супер Мен", floor: 5}
            ];

            $scope.addedPeople = [
                {name: "Дарт Вейдер", floor: 3}
            ];

            //Предзаполнение формы в случае, если редактируем существующее событие
            if( $location.search().id) {
                $scope.isNewEvent = false;

                $scope.q.topic = "Тестовое задание в ШРИ";

                $scope.date = new Date();
                $scope.eventTimeStart = new Date();
                $scope.eventTimeEnd = new Date();

                $scope.roomIsSelected = true;
            }

            $scope.clearTopic = clearTopic;
            $scope.clearParticipantName = clearParticipantName;
            $scope.today = today;
            $scope.openEventCalendar = openEventCalendar;
            $scope.setDate = setDate;
            $scope.calMove = calMove;
            $scope.removeEvent = removeEvent;
            $scope.closeEventForm = closeEventForm;
            $scope.toggleRoomSelection = toggleRoomSelection;
            $scope.addParticipantToEvent = addParticipantToEvent;
            $scope.removeParticipantFromEvent = removeParticipantFromEvent;

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
                $location.search('id', null).path('/');
            }

            function toggleRoomSelection(a) {
                $scope.roomIsSelected = a;
            }

            function addParticipantToEvent(person) {
                $scope.addedPeople.push(angular.copy(person));
                _removeElementFromArrayByName(person, $scope.people);

                $scope.person.selected = undefined;
            }

            function removeParticipantFromEvent(person) {
                $scope.people.push(person);

                _removeElementFromArrayByName(person, $scope.addedPeople);
            }

            function _removeElementFromArrayByName(el, arr) {
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i].name === el.name) {
                        arr.splice(i, 1);
                        break;
                    }
                }
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