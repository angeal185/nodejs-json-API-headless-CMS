'use strict';

/**
 * @ngdoc directive
 * @name myAppApp.directive:gallery
 * @description
 * # gallery
 */
angular.module('myAppApp')
.directive('gallery',
  function () {
    var template =  '<div id="simple-gallery">' +
                      '<div id="simple-gallery" class="col-sm-12 image">' +
                        '<div class="item active">' +
                          '<img ng-src="{{ currentImage || images[0] }}" class="img-responsive">' +
                        '</div>' +
                      '</div>' +
                      '<div class="col-sm-12">' +
                        '<div class="row">' +
                          '<div class="col-sm-12" id="slider-thumbs">' +
                            '<ul>' +
                              '<li ng-repeat="image in images track by $index">' +
                                '<a ng-click="activateImg($index)" href="">' +
                                  '<img ng-src="{{ image }}" class="img-responsive simple-gallery-thumbnail">' +
                                '</a>' +
                              '</li>' +
                            '</ul>' +
                          '</div>' +
                        '</div>' +
                        '</div>' +
                      '</div>';
    return {
      restrict: 'E',
      template: template,
      controller: function ($scope,$http) {
		  
		$scope.images = [
		  'http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400','http://placehold.it/1000x400',
		]  
		  
        $scope.activateImg = function (index) {
			
          $scope.currentImage = $scope.images[index];
		  
        };
      },
      link: function (scope, element, attrs) {
		  
        scope.currentImage = scope.images[0] || {};
      }
    };
  });