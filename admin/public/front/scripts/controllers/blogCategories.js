'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:CategoriesCtrl
 * @description
 * # CategoriesCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
  .controller('blogCategoriesCtrl', ['$scope','$http','$routeParams','$location',
		 function($scope, $http, $routeParams, $location){
				var locale = $routeParams.category;
				$scope.breadcrumb = {
					"header": "Blog categories",
					"sub": "Blog categories sub",
					"active": $location.url()
				};
				$scope.disqusConfig = {
					disqus_shortname: 'blog-4l5uws4c2a',
					disqus_identifier: locale,
					disqus_url: $location.absUrl() //'http://localhost:9000/#!' + $location.url()
				};
				$http.get('scripts/data/posts.json').then(function(res){
					$scope.items = res.data;
				});
				
				$scope.categoryFilter = function(item)
					{
						return (item.category === locale);
					};
				
				console.log($location.absUrl());
				//console.log($location.absUrl());
				console.log(locale);
			}]
		);