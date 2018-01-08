(function() {
    angular.module("MainApp", ["AppApi", "Ui", "ngSanitize", "ngAnimate", "ui.bootstrap", "ng-drag-scroll"])
        .controller("MainController", function MainController($scope, $rootScope, $location, AppApi)
        {
            $rootScope.showCreateButton = true;
            $scope.hoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            $scope.selectedEvent = {};
            $scope.forTooltips = {};
            $scope.currentTime = "";
            $scope.rooms = [];
            $scope.floorsObj = {};
            $scope.floors = [];
            $scope.allEvents = [];

            $scope.toggleEventInfo = toggleEventInfo;
            $scope.toggleAddButtonPress = toggleAddButtonPress;
            $scope.toggleShowAddButton = toggleShowAddButton;
            $scope.today = today;
            $scope.openCalendar = openCalendar;
            $scope.setDate = setDate;
            $scope.formDateText = formDateText;
            $scope.formAdditionalText = formAdditionalText;
            $scope.calMove = calMove;
            $scope.locateToEvent = locateToEvent;
            $scope.isPreviousHour = isPreviousHour;
            $scope.moveAddButton = moveAddButton;
            $scope.calcEventWidth = calcEventWidth;
            $scope.calcEventLeft = calcEventLeft;
            $scope.createNewEvent = createNewEvent;
            $scope.declOfNum = declOfNum;

            let monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь",
                "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
            ];

            //Drag of dashboard
            let dashboard = document.getElementsByClassName("dashboard");
            let wrappedResult = angular.element(dashboard);

            let timeline = document.getElementsByClassName("timeline");
            let floorsList = document.getElementsByClassName("floors-list-wrap");

            angular.element(wrappedResult).bind("scroll", function(e) {
                e = e || window.event;

                timeline[0].style.transform = "translateX(-" + e.target.scrollLeft + "px)";
                floorsList[0].style.transform = "translateY(-" + e.target.scrollTop + "px)";
            });

            function toggleShowAddButton(a, room) {
                room.hovered = a;

                if(!a) {
                    room.pressed = false;
                }
            }

            function toggleAddButtonPress(a, room) {
                room.pressed = a;
            }

            function locateToEvent(eventId) {
                $location.path('/event').search({id: eventId});
            }

            function isPreviousHour(h) {
                return h <= new Date().getHours();
            }

            function moveAddButton(e) {
                let el = e.target.getElementsByClassName('add-event-button')[0];

                if(el) {
                    el.style.top = 0;
                    el.style.left = e.clientX - 245 - 28 + dashboard[0].scrollLeft;
                 }
            }

            function toggleEventInfo(e, ev, room) {
                e = e || window.event;

                if($scope.selectedEvent.id === ev.id) {
                    $scope.forTooltips.showEventInfo = !$scope.forTooltips.showEventInfo;
                } else {
                    $scope.forTooltips.showEventInfo = true;
                }

                $scope.selectedEvent = ev;
                $scope.selectedEvent.room = room;

                AppApi.getEventUsers(ev.id).then(function (res) {
                    $scope.selectedEvent.users = res;
                }, function (err) {
                    console.log(err);
                });

                let eventInfoBlock = document.getElementsByClassName("event-info")[0];
                let eventBlockWidth = 330;
                let preLeft = e.currentTarget.getBoundingClientRect().left - (eventBlockWidth - e.currentTarget.clientWidth) / 2;

                eventInfoBlock.style.left = (preLeft + eventBlockWidth > document.body.clientWidth ? (document.body.clientWidth - eventBlockWidth) : (preLeft > 0 ? preLeft : 0)) + "px";
                eventInfoBlock.style.top = e.currentTarget.getBoundingClientRect().top + e.currentTarget.clientHeight + "px";
            }

            function createNewEvent(e, room) {
                $location.path('/event').search({roomId: room.id, date: encodeURIComponent(new Date($scope.dt).getFullYear() + "-" + (new Date($scope.dt).getMonth()) + "-" + new Date($scope.dt).getDate())});
            }

            //Current time identifier
            let currentTimeElement = document.getElementsByClassName("current-time")[0];
            let currentTimeElementText = document.getElementsByClassName("current-time")[0].getElementsByClassName("time")[0];

            function currentTime() {
                if(timeline[0]) {
                    let xPos = (new Date().getHours() * 60 + new Date().getMinutes() + 30) * timeline[0].clientWidth / (24 * 60) - currentTimeElement.clientWidth / 2;

                    currentTimeElement.style.left = xPos;
                    currentTimeElementText.innerText = new Date().getHours() + ":" + (new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes());

                    setTimeout(currentTime, 1000);
                }
            }

            currentTime();

            function formDateText(date) {
                return new Date(date).getDate() + " " + monthNames[new Date(date).getMonth()].substring(0, 3);
            }

            function formAdditionalText(date) {
                let rez = "";

                if(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate()).getTime() === new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) {
                    rez = "· Сегодня";
                } else {
                    rez = " " + new Date(date).getFullYear();
                }

                return rez;
            }

            function calMove(a) {
                let currentDate = new Date($scope.dt);
                currentDate.setDate(currentDate.getDate() + a);
                $scope.dt = new Date(currentDate);

                //Удаляем events в каждой комнате при изменении даты.
                for(let i = 0; i < $scope.floors.length; i++) {
                    for(let j = 0; j < $scope.floors[i].rooms.length; j++) {
                        delete $scope.floors[i].rooms[j].events;
                    }
                }

                _addEventsToRooms(angular.copy($scope.allEvents));
            }

            function calcEventWidth(event) {
                return (new Date(event.dateEnd).getTime() - new Date(event.dateStart).getTime()) / (1000 * 60) * 100 / (24.5 * 60) + '%';
            }

            function calcEventLeft(event) {
                return ((new Date(event.dateStart).getTime() - new Date(_startOfDate($scope.dt)).getTime()) / (1000 * 60) + 30) * 100 / (24.5 * 60) + '%';
            }

            function _startOfDate(dt) {
                return new Date(new Date(dt).getFullYear(), new Date(dt).getMonth(), new Date(dt).getDate(), 0, 0, 0);
            }

            //Получаем комнаты и созданные события.
            AppApi.getRooms().then(function (res) {

                //Группировка комнат по этажам
                for(let i = 0; i < res.length; i++) {
                    if(!$scope.floorsObj[res[i].floor]) {
                        $scope.floorsObj[res[i].floor] = {floor: res[i].floor, rooms: []};
                    }

                    $scope.floorsObj[res[i].floor].rooms.push(res[i]);
                }

                $scope.floors = Object.values($scope.floorsObj);

                //После получения всех комнат, получаем события.
                getEvents();

            }, function (err) {
                console.log(err);
            });

            function getEvents() {
                AppApi.getEvents().then(function (res) {

                    $scope.allEvents = angular.copy(res);

                    _addEventsToRooms(res);

                }, function (err) {
                    console.log(err);
                });
            }

            function declOfNum(number, titles) {
                let cases = [2, 0, 1, 1, 1, 2];
                return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
            }

            function _addEventsToRooms(res) {
                //Выберем только те события, которые пересекаются с указанной датой.
                let filteredEvents = res.filter(_datesHaveIntersection);

                //Занесем созданные events в соответствующие rooms.
                for(let i = 0; i < $scope.floors.length; i++) {
                    for(let j = 0; j < $scope.floors[i].rooms.length; j++) {
                        for(let k = 0; k < filteredEvents.length; k++) {
                            if($scope.floors[i].rooms[j].id === filteredEvents[k].RoomId) {
                                if(!$scope.floors[i].rooms[j].events) {
                                    $scope.floors[i].rooms[j].events = [];
                                }

                                $scope.floors[i].rooms[j].events.push(filteredEvents[k]);
                            }
                        }
                    }
                }
            }

            function _datesHaveIntersection(ev) {
                function getFormattedString(date) {
                    return new Date(date).getFullYear() + "-" + new Date(date).getMonth() + "-" + new Date(date).getDate();
                }

                return (getFormattedString(ev.dateStart) === getFormattedString($scope.dt));
            }

            //Calendar
            $scope.popup1 = {
                opened: false
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                minDate: new Date(),
                startingDay: 1,
                showWeeks: false,
                maxMode: 'day'
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            function openCalendar() {
                $scope.popup1.opened = true;
            }

            function setDate(year, month, day) {
                $scope.dt = new Date(year, month, day);
            }

            function today() {
                $scope.dt = new Date();
            }

            today();
        });
}());