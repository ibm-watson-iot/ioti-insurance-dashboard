'use strict';

angular.module('BlurAdmin.services').factory('cityLocationService', function($http) {
    return {
        me: function() {
            return $http.get('../data/CityLocations.json');
        }
    };
});
