'use strict';

/**
 * @ngdoc overview
 * @name myAppApp
 * @description
 * # myAppApp
 *
 * Main module of the application.
 */
angular
  .module('myAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'slickCarousel',
	'ngParallax',
	'starRating',
	'breadcrumbs',
	'scrollup',
	'angularUtils.directives.dirPagination',
	'ngDisqus',
	'ngLightbox'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'blog'
      })
	  .when('/blog/posts/:slug', {
          templateUrl: 'views/single-post.html',
		  controller: 'BlogPostCtrl',
        })
	  .when('/store', {
        templateUrl: 'views/store.html',
        controller: 'StoreCtrl',
        controllerAs: 'store'
      })
	  .when('/store/items/:slug', {
          templateUrl: 'views/single-item.html',
		  controller: 'StoreItemCtrl',
        })
      .when('/gallery', {
        templateUrl: 'views/gallery.html',
        controller: 'GalleryCtrl',
        controllerAs: 'gallery'
      })
      .when('/blog/categories/:category', {
        templateUrl: 'views/blogCategories.html',
        controller: 'blogCategoriesCtrl'
      })
	  .when('/store/categories/:category', {
        templateUrl: 'views/storeCategories.html',
        controller: 'storeCategoriesCtrl'
      })
	  /*--- views ---*/
      .otherwise({
        redirectTo: '/'
      });
	  new WOW().init();
  });
