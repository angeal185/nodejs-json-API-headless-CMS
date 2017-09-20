'use strict';

/**
 * @ngdoc service
 * @name myAppApp.singleItem
 * @description
 * # singleItem
 * Factory in the myAppApp.
 */
angular.module('myAppApp')
    .factory('singleItem', function($http) {
        return {
            getData: function() {
                return $http({
                    url: 'scripts/data/items.json',
                    method: 'GET'
                });
            }
        };
    });
