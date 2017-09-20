'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:StoreItemCtrl
 * @description
 * # StoreitemCtrl
 * Controller of the myAppApp
*/

angular.module('myAppApp')
	.controller("StoreItemCtrl", ['$scope','$http','$routeParams',
	 function($scope, $http, $routeParams){   
			$scope.breadcrumb = {
				"header": "items page header",
				"sub": "items page sub",
				"active": "items"
			};
			var locale = $routeParams.slug;
			//console.log(locale);
			$http.get('scripts/data/items/'+ locale +'.json').then(function(res){
				$scope.items = res.data;
				console.log(res.data);
			}); 
		}]
);