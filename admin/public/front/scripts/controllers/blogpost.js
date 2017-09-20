'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:BlogpostCtrl
 * @description
 * # BlogpostCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
	.controller("BlogPostCtrl", ['$scope','$http','$routeParams','$location',
		 function($scope, $http, $routeParams, $location){
				var locale = $routeParams.slug;
				$scope.breadcrumb = {
					"header": "posts page header",
					"sub": "posts page sub",
					"active": "posts"
				};
				$scope.disqusConfig = {
					disqus_shortname: 'blog-4l5uws4c2a',
					disqus_identifier: locale,
					disqus_url: $location.absUrl() //'http://localhost:9000/#!' + $location.url()
				};
				$http.get('scripts/data/posts/'+ locale +'.json').then(function(res){
					$scope.items = res.data;
				});
				console.log($location.absUrl());
				//console.log($location.absUrl());
				//console.log(locale);
			}]
		);

  
  	