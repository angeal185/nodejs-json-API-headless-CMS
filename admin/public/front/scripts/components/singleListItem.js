angular.module('myAppApp').component('singleListItem',{
      template: '<div class="entry-image"><a href="#!/store/items/{{$ctrl.item.slug}}"><img src="{{$ctrl.item.img[0]}}" alt="Image"></a></div><div class="entry-c"><div class="entry-title"><h4><a href="#!/store/items/{{$ctrl.item.slug}}">{{$ctrl.item.name}}</a></h4></div><ul class="entry-meta"><li class="color">{{$ctrl.item.price | currency:"AUD$"}}</li></ul><rating value="item.stars" max="5"></rating></div>',
	  controller: 'StoreCtrl',
	  bindings: {
		items: '='
	  }
  });