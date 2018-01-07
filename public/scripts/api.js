(function() {
    angular.module("AppApi", []).factory("AppApi", AppApi);

    AppApi.$inject = ["$q", "$http"];

    function AppApi($q, $http)
    {
        return {
            getRooms: getRooms,
            getEvents: getEvents,
            getUsers: getUsers,
            getEventUsers: getEventUsers,
            createEvent: createEvent,
            updateEvent: updateEvent,
            deleteEvent: deleteEvent
        };

        function getRooms()
        {
            return httpGetRequest('/api/getRooms', {});
        }

        function getEvents()
        {
            return httpGetRequest('/api/getEvents', {});
        }

        function getUsers()
        {
            return httpGetRequest('/api/getUsers', {});
        }

        function getEventUsers(id) {
            return httpGetRequest('/api/getEventUsers', {id: id});
        }

        function createEvent() {
            return httpPostRequest('/api/createEvent', {});
        }

        function updateEvent() {
            return httpPostRequest('/api/updateEvent', {});
        }

        function deleteEvent() {
            return httpPostRequest('/api/deleteEvent', {});
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