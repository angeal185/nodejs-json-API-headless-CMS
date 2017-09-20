'use strict';
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'ngParallax';
}

angular.module('ngParallax', []);

angular.module('ngParallax').directive('ngParallax', [
  '$timeout', function($window, $timeout) {
    return {
      restrict: 'AE',
      scope: {
        pattern: '=',
        speed: '='
      },
      link: function(scope, elem, attr) {
        var bgObj, execute, isMobile;
        execute = function() {
          var scrollTop, speed;
          scrollTop = window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
          speed = scrollTop / scope.speed;
          if (isMobile) {
            speed = speed * .10;
          }
          if (speed === 0) {
            bgObj.style.backgroundPosition = '0% ' + 0 + '%';
          } else {
            bgObj.style.backgroundPosition = '0% ' + speed + '%';
          }
        };
        window.mobileAndTabletcheck = function() {
          return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
        };
        bgObj = elem[0];
        bgObj.style.height = '100%';
        bgObj.style.margin = '0 auto';
        bgObj.style.position = 'relative';
        bgObj.style.background = 'url(' + scope.pattern + ')';
        bgObj.style.backgroundAttachment = 'fixed';
        bgObj.style.backgroundRepeat = 'repeat';
        bgObj.style.backgroundSize = 'cover';
        isMobile = window.mobileAndTabletcheck();
        window.document.addEventListener('touchmove', function() {
          execute();
        });
        window.document.addEventListener('scroll', function() {
          execute();
        });
        execute();
      }
    };
  }
]);