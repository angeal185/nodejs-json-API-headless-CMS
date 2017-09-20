(function() {
    "use strict";

    angular.module("starRating", []).component("rating", {
        template: '<span class="rating-container">' +
        '<span class="star glyphicon glyphicon-star" ng-class="{\'star-on\':entry.filled, \'star-high\':entry.highlighted}"' +
        ' ng-repeat="entry in model.stars track by $index"></span>' +
        '</span>',
        bindings: {
            value: "=",
            max: "<",
            color: "@",
            align: "@"
        },
        transclude: true,
        controllerAs: "model",
        controller: RatingController
    });

    RatingController.$inject = ["$timeout", "$scope"];

    function RatingController($timeout, $scope) {
        var model = this;


        if (!model.value) {
            if (model.value !== 0)
                model.value = 1;
        }

        if (!model.color)
            model.color = "#555555";

        if (!model.highColor)
            model.highColor = "#555555";

        if (model.max == undefined) {
            model.max = 5;
        }

        $scope.$watch('model.value', function() {
            model.stars = drawStars(model.value, model.max);
        });


        function drawStars(rateValue, maxValue) {
            var stars = [];
            for (var i = 0; i < maxValue; i++) {
                stars.push({
                    filled: i < rateValue
                });
            }
            return stars;
        }
		
        // the following is the insertion of styles into page onload
        var rating = {
            selector: 'rating',
            rules: [
                'text-align: ' + (model.align || 'center'),
                'display:inline-block;',
                'padding-bottom: 3px'
            ]
        }
        var star = {
            selector: '.star',
            rules: [
                'font-size: 18px',
                'color: #ddd',
                'cursor: pointer'
            ]
        }
        var starOthers = {
            selector: '.star+.star',
            rules: [
                'margin-left: 3px'
            ]
        }
        var starOn = {
            selector: '.star.star-on',
            rules: [
                'color:' + model.color
            ]
        }
        var starHigh = {
            selector: '.star.star-high',
            rules: [
                'color:' + model.highColor
            ]
        }

        var ratingCSS = rating.selector + '{' + rating.rules.join(';') + '}';
        var starCSS = star.selector + '{' + star.rules.join(';') + '}';
        var starOthersCSS = starOthers.selector + '{' + starOthers.rules.join(';') + '}';
        var starOnCSS = starOn.selector + '{' + starOn.rules.join(';') + '}';
        var starHighCSS = starHigh.selector + '{' + starHigh.rules.join(';') + '}';
        angular.element(document).find('head').prepend('<style type="text/css">' + ratingCSS + starCSS + starOthersCSS + starOnCSS + starHighCSS + '</style>');
    }

} ());