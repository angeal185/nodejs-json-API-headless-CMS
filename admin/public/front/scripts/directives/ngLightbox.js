
angular.module('ngLightbox', [
    'ui.bootstrap'
]);

// optional dependencies
try {
    angular.module('angular-loading-bar');
    angular.module('ngLightbox').requires.push('angular-loading-bar');
} catch (e) {}

try {
    angular.module('ngTouch');
    angular.module('ngLightbox').requires.push('ngTouch');
} catch (e) {}

try {
    angular.module('videosharing-embed');
    angular.module('ngLightbox').requires.push('videosharing-embed');
} catch (e) {}
angular.module('ngLightbox').run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('lightbox.html',
"<div class='modal-body' ng-click=$dismiss()>" +
	"<div class='lightbox-image-container' ng-swipe-left='Lightbox.nextImage()' ng-swipe-right='Lightbox.prevImage()'>" +
		"<div class='lightbox-image-caption'>" +
			"<span>{{Lightbox.imageCaption}}</span>" +
		"</div>" +
		"<img ng-if='!Lightbox.isVideo(Lightbox.image)' lightbox-src='{{Lightbox.imageUrl}}'>" +
		"<div ng-if='Lightbox.isVideo(Lightbox.image)' class='embed-responsive embed-responsive-16by9'>" +
			"<video ng-if='!Lightbox.isSharedVideo(Lightbox.image)' lightbox-src='{{Lightbox.imageUrl}}' controls autoplay></video>" +
			"<embed-video ng-if='Lightbox.isSharedVideo(Lightbox.image)' lightbox-src='{{Lightbox.imageUrl}}'  ng-href='{{Lightbox.imageUrl}}' iframe-id='lightbox-video' class='embed-responsive-item'><a ng-href='{{Lightbox.imageUrl}}'>Watch video</a></embed-video>" +
		"</div>" +
	"</div>" +
	"<div class='lightbox-nav'>" +
		"<div class='btn-group' ng-if='Lightbox.images.length > 1'>" +
			"<a ng-click='Lightbox.prevImage()' class='button button-reveal button-mini button-black'><i class='icon-angle-left'></i><span>Prev</span></a>" +
			"<a ng-click='Lightbox.nextImage()' class='button button-reveal button-mini button-black tright'><i class='icon-angle-right'></i><span>Next</span></a>" +
		"</div>" +
	"</div>" +
"</div>"
    );

}]);
/**
 * @class     ImageLoader
 * @classdesc Service for loading an image.
 * @memberOf  ngLightbox
 */
angular.module('ngLightbox').service('ImageLoader', ['$q',
    function($q) {

        this.load = function(url) {
            var deferred = $q.defer();

            var image = new Image();

            // when the image has loaded
            image.onload = function() {
                // check image properties for possible errors
                if ((typeof this.complete === 'boolean' && this.complete === false) ||
                    (typeof this.naturalWidth === 'number' && this.naturalWidth === 0)) {
                    deferred.reject();
                }

                deferred.resolve(image);
            };

            // when the image fails to load
            image.onerror = function() {
                deferred.reject();
            };

            // start loading the image
            image.src = url;

            return deferred.promise;
        };
    }
]);

angular.module('ngLightbox').provider('Lightbox', function() {

    this.templateUrl = 'lightbox.html';
    this.fullScreenMode = false;
    this.getImageUrl = function(image) {
        return typeof image === 'string' ? image : image.url;
    };
    this.getImageCaption = function(image) {
        return image.caption;
    };
    this.calculateImageDimensionLimits = function(dimensions) {
        if (dimensions.windowWidth >= 768) {
            return {
                'maxWidth': dimensions.windowWidth - 92,
                'maxHeight': dimensions.windowHeight - 126
            };
        } else {
            return {
                'maxWidth': dimensions.windowWidth - 52,
                'maxHeight': dimensions.windowHeight - 86
            };
        }
    };

    this.calculateModalDimensions = function(dimensions) {
        var width = Math.max(400, dimensions.imageDisplayWidth + 32);
        var height = Math.max(200, dimensions.imageDisplayHeight + 66);

        if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
            width = 'auto';
        }

        if (height >= dimensions.windowHeight) {
            height = 'auto';
        }

        return {
            'width': width,
            'height': height
        };
    };

    this.isVideo = function(image) {
        if (typeof image === 'object' && image && image.type) {
            return image.type === 'video';
        }

        return false;
    };

    this.isSharedVideo = function(image) {
        return this.isVideo(image) &&
            !this.getImageUrl(image).match(/\.(mp4|ogg|webm)$/);
    };

    this.$get = ['$document', '$injector', '$uibModal', '$timeout', 'ImageLoader',
        function($document, $injector, $uibModal, $timeout, ImageLoader) {
            // optional dependency
            var cfpLoadingBar = $injector.has('cfpLoadingBar') ?
                $injector.get('cfpLoadingBar') : null;

            var Lightbox = {};
            Lightbox.images = [];
            Lightbox.index = -1;
            Lightbox.templateUrl = this.templateUrl;
            Lightbox.fullScreenMode = this.fullScreenMode;
            Lightbox.getImageUrl = this.getImageUrl;
            Lightbox.getImageCaption = this.getImageCaption;
            Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
            Lightbox.calculateModalDimensions = this.calculateModalDimensions;
            Lightbox.isVideo = this.isVideo;
            Lightbox.isSharedVideo = this.isSharedVideo;
            Lightbox.keyboardNavEnabled = false;
            Lightbox.image = {};
            Lightbox.modalInstance = null;
            Lightbox.loading = false;
            Lightbox.openModal = function(newImages, newIndex, modalParams) {
                Lightbox.images = newImages;
                Lightbox.setImage(newIndex);
                Lightbox.modalInstance = $uibModal.open(angular.extend({
                    'templateUrl': Lightbox.templateUrl,
                    'controller': ['$scope', function($scope) {
                        $scope.Lightbox = Lightbox;
                        Lightbox.keyboardNavEnabled = true;
                    }],
                    'windowClass': 'lightbox-modal'
                }, modalParams || {}));

                Lightbox.modalInstance.result['finally'](function() {
                    Lightbox.images = [];
                    Lightbox.index = 1;
                    Lightbox.image = {};
                    Lightbox.imageUrl = null;
                    Lightbox.imageCaption = null;
                    Lightbox.keyboardNavEnabled = false;

                    if (cfpLoadingBar) {
                        cfpLoadingBar.complete();
                    }
                });

                return Lightbox.modalInstance;
            };

            Lightbox.closeModal = function(result) {
                return Lightbox.modalInstance.close(result);
            };

            Lightbox.setImage = function(newIndex) {
                if (!(newIndex in Lightbox.images)) {
                    throw 'Invalid image.';
                }

                Lightbox.loading = true;
                if (cfpLoadingBar) {
                    cfpLoadingBar.start();
                }

                var image = Lightbox.images[newIndex];
                var imageUrl = Lightbox.getImageUrl(image);
                var success = function(properties) {
                    properties = properties || {};
                    Lightbox.index = properties.index || newIndex;
                    Lightbox.image = properties.image || image;
                    Lightbox.imageUrl = properties.imageUrl || imageUrl;
                    Lightbox.imageCaption = properties.imageCaption ||
                        Lightbox.getImageCaption(image);
                    Lightbox.loading = false;
                    if (cfpLoadingBar) {
                        cfpLoadingBar.complete();
                    }
                };

                if (!Lightbox.isVideo(image)) {

                    ImageLoader.load(imageUrl).then(function() {
                        success();
                    }, function() {
                        success({
                            'imageUrl': '#',
                            'imageCaption': 'Failed to load image'
                        });
                    });
                } else {
                    success();
                }
            };

            Lightbox.firstImage = function() {
                Lightbox.setImage(0);
            };

            Lightbox.prevImage = function() {
                Lightbox.setImage((Lightbox.index - 1 + Lightbox.images.length) %
                    Lightbox.images.length);
            };

            Lightbox.nextImage = function() {
                Lightbox.setImage((Lightbox.index + 1) % Lightbox.images.length);
            };

            Lightbox.lastImage = function() {
                Lightbox.setImage(Lightbox.images.length - 1);
            };

            Lightbox.setImages = function(newImages) {
                Lightbox.images = newImages;
                Lightbox.setImage(Lightbox.index);
            };

            $document.bind('keydown', function(event) {
                if (!Lightbox.keyboardNavEnabled) {
                    return;
                }

                // method of Lightbox to call
                var method = null;

                switch (event.which) {
                    case 39: // right arrow key
                        method = 'nextImage';
                        break;
                    case 37: // left arrow key
                        method = 'prevImage';
                        break;
                }

                if (method !== null && ['input', 'textarea'].indexOf(
                        event.target.tagName.toLowerCase()) === -1) {
                    // the view doesn't update without a manual digest
                    $timeout(function() {
                        Lightbox[method]();
                    });

                    event.preventDefault();
                }
            });

            return Lightbox;
        }
    ];
});

angular.module('ngLightbox').directive('lightboxSrc', ['$window',
    'ImageLoader', 'Lightbox',
    function($window, ImageLoader, Lightbox) {

        var calculateImageDisplayDimensions = function(dimensions, fullScreenMode) {
            var w = dimensions.width;
            var h = dimensions.height;
            var minW = dimensions.minWidth;
            var minH = dimensions.minHeight;
            var maxW = dimensions.maxWidth;
            var maxH = dimensions.maxHeight;

            var displayW = w;
            var displayH = h;

            if (!fullScreenMode) {

                if (w < minW && h < minH) {
                    if (w / h > maxW / maxH) {
                        displayH = minH;
                        displayW = Math.round(w * minH / h);
                    } else {
                        displayW = minW;
                        displayH = Math.round(h * minW / w);
                    }
                } else if (w < minW) {
                    displayW = minW;
                    displayH = Math.round(h * minW / w);
                } else if (h < minH) {
                    displayH = minH;
                    displayW = Math.round(w * minH / h);
                }

                if (w > maxW && h > maxH) {
                    if (w / h > maxW / maxH) {
                        displayW = maxW;
                        displayH = Math.round(h * maxW / w);
                    } else {
                        displayH = maxH;
                        displayW = Math.round(w * maxH / h);
                    }
                } else if (w > maxW) {
                    displayW = maxW;
                    displayH = Math.round(h * maxW / w);
                } else if (h > maxH) {
                    displayH = maxH;
                    displayW = Math.round(w * maxH / h);
                }
            } else {
 
                var ratio = Math.min(maxW / w, maxH / h);
                var zoomedW = Math.round(w * ratio);
                var zoomedH = Math.round(h * ratio);

                displayW = Math.max(minW, zoomedW);
                displayH = Math.max(minH, zoomedH);
            }

            return {
                'width': displayW || 0,
                'height': displayH || 0 
            };
        };

        var formatDimension = function(dimension) {
            return typeof dimension === 'number' ? dimension + 'px' : dimension;
        };
		
        var imageWidth = 0;
        var imageHeight = 0;

        return {
            'link': function(scope, element, attrs) {
                // resize the img element and the containing modal
                var resize = function() {
                    // get the window dimensions
                    var windowWidth = $window.innerWidth;
                    var windowHeight = $window.innerHeight;

                    // calculate the max/min dimensions for the image
                    var imageDimensionLimits = Lightbox.calculateImageDimensionLimits({
                        'windowWidth': windowWidth,
                        'windowHeight': windowHeight,
                        'imageWidth': imageWidth,
                        'imageHeight': imageHeight
                    });

                    // calculate the dimensions to display the image
                    var imageDisplayDimensions = calculateImageDisplayDimensions(
                        angular.extend({
                            'width': imageWidth,
                            'height': imageHeight,
                            'minWidth': 1,
                            'minHeight': 1,
                            'maxWidth': 3000,
                            'maxHeight': 3000,
                        }, imageDimensionLimits),
                        Lightbox.fullScreenMode
                    );

                    // calculate the dimensions of the modal container
                    var modalDimensions = Lightbox.calculateModalDimensions({
                        'windowWidth': windowWidth,
                        'windowHeight': windowHeight,
                        'imageDisplayWidth': imageDisplayDimensions.width,
                        'imageDisplayHeight': imageDisplayDimensions.height
                    });

                    // resize the image
                    element.css({
                        'width': imageDisplayDimensions.width + 'px',
                        'height': imageDisplayDimensions.height + 'px'
                    });

                    angular.element(
                        document.querySelector('.lightbox-modal .modal-dialog')
                    ).css({
                        'width': formatDimension(modalDimensions.width)
                    });

                    angular.element(
                        document.querySelector('.lightbox-modal .modal-content')
                    ).css({
                        'height': formatDimension(modalDimensions.height)
                    });
                };

                // load the new image and/or resize the video whenever the attr changes
                scope.$watch(function() {
                    return attrs.lightboxSrc;
                }, function(src) {
                    // do nothing if there's no image
                    if (!Lightbox.image) {
                        return;
                    }

                    if (!Lightbox.isVideo(Lightbox.image)) { // image
                        // blank the image before resizing the element
                        element[0].src = '#';

                        // handle failure to load the image
                        var failure = function() {
                            imageWidth = 0;
                            imageHeight = 0;

                            resize();
                        };

                        if (src) {
                            ImageLoader.load(src).then(function(image) {
                                // these variables must be set before resize(), as they are used
                                // in it
                                imageWidth = image.naturalWidth;
                                imageHeight = image.naturalHeight;

                                // resize the img element and the containing modal
                                resize();

                                // show the image
                                element[0].src = src;
                            }, failure);
                        } else {
                            failure();
                        }
                    } else { // video
                        // default dimensions
                        imageWidth = 1280;
                        imageHeight = 720;

                        // resize the video element and the containing modal
                        resize();

                        // the src attribute applies to `<video>` and not `<embed-video>`
                        element[0].src = src;
                    }
                });

                // resize the image and modal whenever the window gets resized
                angular.element($window).on('resize', resize);
            }
        };
    }
]);