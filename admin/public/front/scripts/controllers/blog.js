'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:BlogCtrl
 * @description
 * # BlogCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
  .controller('BlogCtrl', function ($scope, $http) {

	$scope.breadcrumb = {"header":"Blog page header","sub":"Blog page sub","active":"Blog"};
	
	$http.get("scripts/data/posts.json")
	.then(function(res){
		$scope.items = res.data; 
	});
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
 
  
  var url ="https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=9b392a2a0a635f1ea89045822ba18b69&user_id=146614435%40N04&per_page=12&format=json&nojsoncallback=1&auth_token=72157684038202730-b479d5b97ed9fc7b&api_sig=2b022c09484b54a3c2332038099cdcc6";

    $http.get(url).then(function(response) {
		//console.log(response.data.photos.photo[0]);
     $scope.flickr = response.data.photos.photo;
	  
    });

  
  
});
