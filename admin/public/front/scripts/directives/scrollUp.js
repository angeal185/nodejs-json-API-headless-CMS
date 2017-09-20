angular.module("scrollup", []);
angular.module('scrollup').directive("scrollup",
    function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<a class="scroll-to-top" ng-click="scrollToTop()"></a>',
            controller: function($scope) {
                $scope.scrollToTop = function() {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 900);
                };
            },
            link: function(scope, element, attrs) {
                $(window).scroll(function() {
                    if ($(this).scrollTop() > 200) {
                        $('.scroll-to-top').css('display', 'block');
                    } else {
                        $('.scroll-to-top').css('display', 'none');
                    }
                });
            }
        };
    }
);

