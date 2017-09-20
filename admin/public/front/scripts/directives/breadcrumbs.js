angular.module("breadcrumbs", [])
.directive("breadcrumbs", function() {
    return {
        template : "<section id='page-title'><div class='container clearfix'><h1>{{breadcrumb.header}}</h1><span>{{breadcrumb.sub}}</span><ol class='breadcrumb'><li><a  class='breadcrumb-text'>{{breadcrumb.active}}</a></li></ol></div></section>"
    };
});


