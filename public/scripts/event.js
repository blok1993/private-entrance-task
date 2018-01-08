(function() {
    angular.module("EventApp", ["AppApi", "Ui", "ngSanitize", "ngAnimate", "ui.bootstrap", "ui.mask", "ui.select"])
        .controller("EventController", function EventController($scope, $rootScope, UiModal, $location, AppApi, $filter, $q)
        {
            $rootScope.showCreateButton = false;
            $scope.q = {};
            $scope.person = {};
            $scope.recommendedRooms = [];
            $scope.selectedRoom = {};
            $scope.isNewEvent = true;
            $scope.roomIsSelected = false;
            $scope.users = [];
            $scope.addedUsers = [];
            $scope.rooms = [];

            $scope.clearTopic = clearTopic;
            $scope.clearParticipantName = clearParticipantName;
            $scope.today = today;
            $scope.openEventCalendar = openEventCalendar;
            $scope.setDate = setDate;
            $scope.calMove = calMove;
            $scope.createEvent = createEvent;
            $scope.updateEvent = updateEvent;
            $scope.removeEvent = removeEvent;
            $scope.closeEventForm = closeEventForm;
            $scope.toggleRoomSelection = toggleRoomSelection;
            $scope.addParticipantToEvent = addParticipantToEvent;
            $scope.removeParticipantFromEvent = removeParticipantFromEvent;
            $scope.timeAppearance = timeAppearance;
            $scope.getRecommendation = getRecommendation;

            function clearTopic() {
                $scope.q.topic = '';
            }

            function clearParticipantName() {
                $scope.q.participantName = '';
            }

            function createEvent() {
                let usersIds = _collectUsersIds($scope.addedUsers);
                let eventInput = {
                    title: $scope.q.topic,
                    dateStart: _createDateFromParts($scope.date, $scope.eventTimeStart),
                    dateEnd: _createDateFromParts($scope.date, $scope.eventTimeEnd)
                };

                AppApi.createEvent(eventInput, usersIds, $scope.selectedRoom.id).then(function (res) {
                    UiModal.info("Встреча создана!", _formCorrectDateOfEvent(res) + " \n " + $scope.selectedRoom.title + "&nbsp;·&nbsp;" + $scope.selectedRoom.floor + " этаж", "Хорошо").then(function () {
                        $location.path('/');
                    });
                }, function (err) {
                    console.log(err);
                });
            }

            function updateEvent() {
                let id = $location.search().id;
                let eventInput = {
                    title: $scope.q.topic,
                    dateStart: _createDateFromParts($scope.date, $scope.eventTimeStart),
                    dateEnd: _createDateFromParts($scope.date, $scope.eventTimeEnd)
                };

                AppApi.updateEvent(id, eventInput).then(function (res) {
                    UiModal.info("Встреча успешно обновлена!", "", "Хорошо");
                }, function (err) {
                    console.log(err);
                });
            }

            function removeEvent() {
                UiModal.question("Встреча будет \n удалена безвозвратно", "", "Удалить", "Отмена").then(function () {
                    AppApi.removeEvent($location.search().id).then(function () {
                        UiModal.info("Встреча успешно удалена!", "", "Хорошо").then(function () {
                            $location.path('/').search({});
                        });
                    }, function (err) {
                       console.log(err);
                    });
                });
            }

            function closeEventForm() {
                $location.path('/').search({});
            }

            function toggleRoomSelection(a, room) {
                $scope.roomIsSelected = a;

                if($location.search().id && a) {
                    AppApi.changeEventRoom($location.search().id, room.id).then(function (data) {
                        console.log("Переговорка была успешно изменена.");
                    });
                }

                $scope.selectedRoom = a ? room : undefined;

                if(!a) {
                    getRecommendation();
                }
            }

            function addParticipantToEvent(person, flg) {
                $scope.addedUsers.push(angular.copy(person));
                _removeElementFromArrayByName(person, $scope.users);

                if($location.search().id && flg) {
                    AppApi.addUserToEvent($location.search().id, person.id).then(function (data) {
                        console.log("Пользователь успешно добавлен.");

                        getRecommendation();
                    });
                } else {
                    getRecommendation();
                }

                $scope.person.selected = undefined;
            }

            function removeParticipantFromEvent(person, flg) {
                $scope.users.push(person);

                _removeElementFromArrayByName(person, $scope.addedUsers);

                if($location.search().id && flg) {
                    AppApi.removeUserFromEvent($location.search().id, person.id).then(function (data) {
                        console.log("Пользователь был удален из встречи.");

                        getRecommendation();
                    });
                } else {
                    getRecommendation();
                }
            }

            function _removeElementFromArrayByName(el, arr) {
                for(let i = 0; i < arr.length; i++) {
                    if(arr[i].login === el.login) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }

            function getUsers() {
                return AppApi.getUsers().then(function (res) {
                    $scope.users = res;
                    return res;
                }, function (err) {
                    console.log(err);
                });
            }

            function getRooms() {
                return AppApi.getRooms().then(function (res) {
                    $scope.rooms = res;
                    return res;
                }, function (err) {
                    console.log(err);
                });
            }

            function getEvent(id) {
                return AppApi.getEvent(id).then(function (res) {
                    return res;
                }, function (err) {
                    console.log(err);
                });
            }

            function getEventUsers(id) {
                return AppApi.getEventUsers(id).then(function (res) {
                    return res;
                }, function (err) {
                    console.log(err);
                });
            }

            //После получения всех необхожимых данных, парсим url
            $q.all([getUsers(), getRooms()]).then(function(data) {

                //Предзаполнение формы в зависимости от параметров в url
                if($location.search().id) {

                    let eventId = $location.search().id;
                    $scope.isNewEvent = false;

                    $q.all([getEvent(eventId), getEventUsers(eventId)]).then(function(data) {
                        let event = data[0];
                        let dateStart = data[0].dateStart;
                        let dateEnd = data[0].dateEnd;
                        let eventUsers = data[1];

                        $scope.q.topic = event.title;

                        $scope.date = new Date(dateStart);
                        $scope.eventTimeStart = _createTimeString(new Date(dateStart));
                        $scope.eventTimeEnd = _createTimeString(new Date(dateEnd));

                        _selectRoom(event.RoomId);

                        eventUsers.forEach(function (el) {
                            addParticipantToEvent(el);
                        });

                    }, function (err) {
                        console.log(err);
                    });

                } else if($location.search().roomId && $location.search().date) {
                    let roomId = $location.search().roomId;
                    let date = $location.search().date;

                    $scope.date = new Date(date.split('-')[0], date.split('-')[1], date.split('-')[2]);
                    $scope.eventTimeStart = _createTimeString(new Date($scope.date));
                    $scope.eventTimeEnd = _createTimeString(new Date(new Date($scope.date).getTime() + 60 * 60 * 1000));

                    _selectRoom(roomId);
                }
            });

            function _collectUsersIds(users) {
                return users.map(function(user) {
                    return user.id;
                });
            }

            function _createTimeString(date) {
                return (new Date(date).getHours() > 9 ? new Date(date).getHours() : "0" + new Date(date).getHours()) + "" + (new Date(date).getMinutes() > 9 ? new Date(date).getMinutes() : "0" + new Date(date).getMinutes());
            }

            function _selectRoom(roomId) {
                for(let i = 0; i < $scope.rooms.length; i++) {
                    if($scope.rooms[i].id == roomId) {
                        $scope.selectedRoom = $scope.rooms[i];
                        $scope.roomIsSelected = true;
                        break;
                    }
                }
            }

            function timeAppearance(time) {
                return time ? time.slice(0, -2) + ":" + time.slice(-2) : null;
            }

            function _createDateFromParts(date, time) {
                return new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time.slice(0, -2), time.slice(-2), 0);
            }

            function _formCorrectDateOfEvent(event) {
                return $filter('date')(event.dateStart, "d MMMM") + ", " + $filter('date')(event.dateStart, "HH:mm") + " — " + $filter('date')(event.dateEnd, "HH:mm");
            }

            function getRecommendation() {
                if($scope.eventTimeStart && $scope.eventTimeEnd && ($scope.roomIsSelected === false) && $scope.addedUsers.length) {

                    let date = {
                        start: new Date(_createDateFromParts($scope.date, $scope.eventTimeStart)).getTime(),
                        end: new Date(_createDateFromParts($scope.date, $scope.eventTimeEnd)).getTime()
                    };

                    let members = $scope.addedUsers.map(function (person) {
                        return {
                            login: person.login,
                            floor: person.homeFloor,
                            avatar: person.avatarUrl
                        };
                    });

                    if(date.start < date.end) {
                        AppApi.getRecommendation(date, members).then(function (data) {
                            if(data.status === 1) {
                                $scope.recMessage = data.message;
                                $scope.recommendedRooms = [];
                            } else {
                                $scope.recMessage = null;

                                for(let i = 0; i < data.length; i++) {
                                    for(let j = 0; j < $scope.rooms.length; j++) {
                                        if(data[i].room === $scope.rooms[j].id) {
                                            data[i].title = $scope.rooms[j].title;
                                            data[i].floor = $scope.rooms[j].floor;
                                            data[i].id = $scope.rooms[j].id;
                                        }
                                    }
                                }

                                $scope.recommendedRooms = data;

                            }
                        }, function (err) {
                            console.log(err);
                        });
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
                let currentDate = new Date($scope.date);
                currentDate.setDate(currentDate.getDate() + a);
                $scope.date = new Date(currentDate);
            }
        });
}());