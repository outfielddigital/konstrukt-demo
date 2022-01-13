(function () {

    'use strict';

    var cache = new Map();

    function konstruktRouteCache($rootScope, $q) {

        var api = {

            getOrFetch: function (key, action) {
                if (!cache.has(key)) {
                    cache.set(key, action().then(function (data) {
                        cache.set(key, data);
                        return data;
                    }));
                }
                return $q.when(cache.get(key));
            },

            get: function (key) {
                return $q.when(cache.has(key) ? cache.get(key) : null);
            },

            clear: function (key) {
                cache.delete(key);
            },

            clearAll: function () {
                cache.clear();
            }

        };

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            api.clearAll();
        });

        return api;

    };

    angular.module('umbraco.services').factory('konstruktRouteCache', konstruktRouteCache);

}());