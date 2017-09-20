'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:GalleryCtrl
 * @description
 * # GalleryCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
  .controller('GalleryCtrl', function ($scope, $http, Lightbox) {

	$scope.breadcrumb = {
            "header": "gallery page header",
            "sub": "gallery page sub",
            "active": "gallery"
        };
		
  $http.get("scripts/data/gallery.json")
            .then(function(res) {
                $scope.images = res.data;
            });
$scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
 

	

