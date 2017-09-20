angular.module("topList", []);
angular.module("topList").directive("topList", function($scope,$http) {
	
	
	
	return {
        template : "<div class='top-links'><ul  ng-repeat='list in $ctrl.list'><li><a href='{{list.href}}'>{{list.name}}</a></li></ul></div></div>",
		controller: function MainCtrl() {
      this.list = [{
			"href": "faqs",
			"name": "FAQs"
		}, {
			"href": "contact",
			"name": "Contact"
		}, {
			"href": "subscribe",
			"name": "Subscribe"
		}];
    }
    };

});