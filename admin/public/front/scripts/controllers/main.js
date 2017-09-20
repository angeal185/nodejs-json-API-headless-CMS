'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')
  .controller('MainCtrl', function ($scope, $timeout,$http) {
	  $scope.title = 'main';
	  $scope.breadcrumb = {"header":"Home page header","sub":"Home page sub","active":""};
     //====================================
    // Slick 1
    //====================================
    $scope.number1 = [1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18];
    $scope.slickConfig1Loaded = true;
    $scope.updateNumber1 = function () {
      $scope.slickConfig1Loaded = false;
      $scope.number1[2] = '123';
      $scope.number1.push(Math.floor((Math.random() * 10) + 100));
      $timeout(function () {
        $scope.slickConfig1Loaded = true;
      }, 5);
    };
    $scope.slickCurrentIndex = 0;
    $scope.slickConfig = {
      dots: true,
      autoplay: true,
      initialSlide: 3,
      infinite: true,
      autoplaySpeed: 2000,
      method: {}
    };

    //====================================
    // Slick 2
    //====================================
    $scope.number2 = [{label: 1, otherLabel: 1}, {label: 2, otherLabel: 2}, {label: 3, otherLabel: 3}, {
      label: 4,
      otherLabel: 4
    }, {label: 5, otherLabel: 5}, {label: 6, otherLabel: 6}, {label: 7, otherLabel: 7}, {label: 8, otherLabel: 8}, {label: 9, otherLabel: 9}, {label: 10, otherLabel: 10}, {label: 11, otherLabel: 11}, {label: 12, otherLabel: 12}, {label: 13, otherLabel: 13}, {label: 14, otherLabel: 14}, {label: 15, otherLabel: 15}, {label: 16, otherLabel: 16}, {label: 17, otherLabel: 17}, {label: 18, otherLabel: 18}];
    $scope.slickConfig2Loaded = true;
    $scope.updateNumber2 = function () {
      $scope.slickConfig2Loaded = false;
      $scope.number2[2] = 'ggg';
      $scope.number2.push(Math.floor((Math.random() * 10) + 100));
      $timeout(function () {
        $scope.slickConfig2Loaded = true;
      });
    };

    $scope.slickConfig2 = {
		dots: true,
      autoplay: true,
      infinite: true,
      autoplaySpeed: 3000,
      slidesToShow: 6,
      slidesToScroll: 6,
      method: {}
    };

	
	$http.get("scripts/data/data.json")
	.then(function(res){
		$scope.data = res.data[0]; 

	});
   
  });
