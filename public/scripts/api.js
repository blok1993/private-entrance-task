(function() {
    angular.module("AppApi", []).factory("AppApi", AppApi);

    AppApi.$inject = ["$q", "$http"];

    function AppApi($q, $http)
    {
        return {
            getRooms: getRooms,
            getEvent: getEvent,
            getEvents: getEvents,
            getUsers: getUsers,
            getEventUsers: getEventUsers,
            createEvent: createEvent,
            updateEvent: updateEvent,
            removeEvent: removeEvent,
            changeEventRoom: changeEventRoom,
            addUserToEvent: addUserToEvent,
            removeUserFromEvent: removeUserFromEvent,
            getRecommendation: getRecommendation
        };

        function getRooms()
        {
            return httpGetRequest('/api/getRooms', {});
        }

        function getEvents()
        {
            return httpGetRequest('/api/getEvents', {});
        }

        function getEvent(id)
        {
            return httpGetRequest('/api/getEvent', {id: id});
        }

        function getUsers()
        {
            return httpGetRequest('/api/getUsers', {});
        }

        function getEventUsers(id) {
            return httpGetRequest('/api/getEventUsers', {id: id});
        }

        function createEvent(input, usersIds, roomId) {
            return httpPostRequest('/api/createEvent', {input: input, usersIds: usersIds, roomId: roomId});
        }

        function updateEvent(id, input) {
            return httpPostRequest('/api/updateEvent', {id: id, input: input});
        }

        function removeEvent(id) {
            return httpPostRequest('/api/removeEvent', {id: id});
        }

        function changeEventRoom(id, roomId) {
            return httpPostRequest('/api/changeEventRoom', {id: id, roomId: roomId});
        }

        function addUserToEvent(id, userId) {
            return httpPostRequest('/api/addUserToEvent', {id: id, userId: userId});
        }

        function removeUserFromEvent(id, userId) {
            return httpPostRequest('/api/removeUserFromEvent', {id: id, userId: userId});
        }

        function getRecommendation(date, members) {
            return httpPostRequest('/api/getRecommendation', {date: date, members: members});
        }

        function httpGetRequest(url, params, config)
        {
            var deferred = $q.defer();

            $http.get(url, angular.extend({params: params}, config))
                .then(function(response)
                {
                    deferred.resolve(response.data);
                })
                .catch(function(response)
                {
                    deferred.reject(response);
                });

            return deferred.promise;
        }

        function httpPostRequest(url, data, config)
        {
            var deferred = $q.defer();

            $http.post(url, data, config)
                .then(function(response)
                {
                    deferred.resolve(response.data);
                })
                .catch(function(response)
                {
                    deferred.reject(response);
                });

            return deferred.promise;
        }
    }
})();