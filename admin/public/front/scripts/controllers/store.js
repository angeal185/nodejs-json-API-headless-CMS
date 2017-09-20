'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:StoreCtrl
 * @description
 * # StoreCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
    .controller('StoreCtrl', function($scope, $http) {

        $scope.title = "store";
        $scope.breadcrumb = {
            "header": "store page header",
            "sub": "store page sub",
            "active": "store"
        };

        $http.get("scripts/data/items.json")
            .then(function(res) {
                $scope.items = res.data;
            });
        $scope.sort = function(keyname) {
            $scope.sortKey = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        };
		$scope.starsFilter = function(item)
			{
				return (item.stars === 5);
			};
		$scope.onSaleFilter = function(item)
			{
				return (item.label === 'SALE');
			};
    });
