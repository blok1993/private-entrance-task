(function() {
    angular.module("MainApp", ["Ui", "ngSanitize", "ngAnimate", "ui.bootstrap", "ng-drag-scroll"])
        .controller("MainController", function MainController($scope, $rootScope, $location)
        {
            $rootScope.showCreateButton = true;
            $scope.hoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            $scope.selectedEvent = {};
            $scope.forTooltips = {};
            $scope.currentTime = "";

            var monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь",
                "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
            ];

            //Mock data for static content
            $scope.floors = [
                {
                    rooms: [
                        {
                            id: "abc",
                            events: [
                                {
                                    id: "1"
                                },
                                {
                                    id: "2",
                                    free: true
                                },
                                {
                                    id: "3"
                                },
                                {
                                    id: "4",
                                    free: true
                                },
                                {
                                    id: "5"
                                },
                                {
                                    id: "6",
                                    free: true
                                }
                            ]
                        },
                        {
                            id: "abd",
                            events: [
                                {
                                    id: "7"
                                },
                                {
                                    id: "8"
                                },
                                {
                                    id: "9"
                                },
                                {
                                    id: "10"
                                },
                                {
                                    id: "11"
                                },
                                {
                                    id: "12"
                                }
                            ]
                        },
                        {
                            id: "abg",
                            events: [
                                {
                                    id: "13"
                                },
                                {
                                    id: "14",
                                    free: true
                                },
                                {
                                    id: "15"
                                },
                                {
                                    id: "16",
                                    free: true
                                },
                                {
                                    id: "17"
                                },
                                {
                                    id: "18",
                                    free: true
                                }
                            ]
                        }
                    ]
                },
                {
                    rooms: [
                        {
                            id: "azx",
                            events: [
                                {
                                    id: "111"
                                },
                                {
                                    id: "211",
                                    free: true
                                },
                                {
                                    id: "311"
                                },
                                {
                                    id: "411",
                                    free: true
                                },
                                {
                                    id: "511"
                                },
                                {
                                    id: "611",
                                    free: true
                                }
                            ]
                        },
                        {
                            id: "azc",
                            events: [
                                {
                                    id: "221"
                                },
                                {
                                    id: "222"
                                },
                                {
                                    id: "223"
                                },
                                {
                                    id: "224"
                                },
                                {
                                    id: "225"
                                },
                                {
                                    id: "226"
                                }
                            ]
                        },
                        {
                            id: "azb",
                            events: [
                                {
                                    id: "331"
                                },
                                {
                                    id: "332",
                                    free: true
                                },
                                {
                                    id: "333"
                                },
                                {
                                    id: "334",
                                    free: true
                                },
                                {
                                    id: "335"
                                },
                                {
                                    id: "336",
                                    free: true
                                }
                            ]
                        }
                    ]
                }
            ];

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

            function toggleShowAddButton(ev, a, room) {
                if(ev.free) {
                    ev.hovered = a;
                    room.hovered = a;
                }

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

            //Drag of dashboard
            var dashboard = document.getElementsByClassName("dashboard");
            var wrappedResult = angular.element(dashboard);

            var timeline = document.getElementsByClassName("timeline");
            var floorsList = document.getElementsByClassName("floors-list-wrap");

            angular.element(wrappedResult).bind("scroll", function(e) {
                e = e || window.event;

                timeline[0].style.transform = "translateX(-" + e.target.scrollLeft + "px)";
                floorsList[0].style.transform = "translateY(-" + e.target.scrollTop + "px)";
            });

            function moveAddButton(e, ev) {
                if(ev.free && e.target.children[0]) {
                    e.target.children[0].style.top = e.target.offsetTop - dashboard[0].scrollTop;
                    e.target.children[0].style.left = e.clientX - 28;
                }
            }

            function toggleEventInfo(e, ev) {
                e = e || window.event;

                if(!ev.free) {
                    if($scope.selectedEvent.id === ev.id) {
                        $scope.forTooltips.showEventInfo = !$scope.forTooltips.showEventInfo;
                    } else {
                        $scope.forTooltips.showEventInfo = true;
                    }

                    $scope.selectedEvent = ev;

                    var eventInfoBlock = document.getElementsByClassName("event-info")[0];
                    var eventBlockWidth = 330;
                    var preLeft = e.currentTarget.getBoundingClientRect().left - (eventBlockWidth - e.currentTarget.clientWidth) / 2;

                    eventInfoBlock.style.left = (preLeft + eventBlockWidth > document.body.clientWidth ? (document.body.clientWidth - eventBlockWidth) : (preLeft > 0 ? preLeft : 0)) + "px";
                    eventInfoBlock.style.top = e.currentTarget.getBoundingClientRect().top + e.currentTarget.clientHeight + "px";
                } else {
                    locateToEvent();
                }
            }

            //Current time
            var currentTimeElement = document.getElementsByClassName("current-time")[0];
            var currentTimeElementText = document.getElementsByClassName("current-time")[0].getElementsByClassName("time")[0];

            function currentTime() {
                if(timeline[0]) {
                    var xPos;

                    if(new Date().getHours() === 23 && new Date().getMinutes() > 30) {
                        xPos = (new Date().getMinutes() - 30) * timeline[0].clientWidth / (24 * 60) - currentTimeElement.clientWidth / 2 < 0 ? 0 : (new Date().getMinutes() - 30) * timeline[0].clientWidth / (24 * 60) - currentTimeElement.clientWidth / 2;
                    } else {
                        xPos = (new Date().getHours() * 60 + new Date().getMinutes() + 30) * timeline[0].clientWidth / (24 * 60) - currentTimeElement.clientWidth / 2;
                    }

                    currentTimeElement.style.left = xPos;
                    currentTimeElementText.innerText = new Date().getHours() + ":" + (new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes());

                    setTimeout(currentTime, 1000);
                }
            }

            currentTime();

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

            function formDateText(date) {
                return new Date(date).getDate() + " " + monthNames[new Date(date).getMonth()].substring(0, 3);
            }

            function formAdditionalText(date) {
                var rez = "";

                if(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate()).getTime() === new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) {
                    rez = "· Сегодня";
                } else {
                    rez = " " + new Date(date).getFullYear();
                }

                return rez;
            }

            function calMove(a) {
                var currentDate = new Date($scope.dt);
                currentDate.setDate(currentDate.getDate() + a);
                $scope.dt = new Date(currentDate);
            }
        });
}());