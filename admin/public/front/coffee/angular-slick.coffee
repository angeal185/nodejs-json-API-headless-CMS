'use strict'
angular.module('slickCarousel', []).constant('slickCarouselConfig',
  method: {}
  event: {}).directive 'slick', [
  '$timeout'
  'slickCarouselConfig'
  ($timeout, slickCarouselConfig) ->
    slickMethodList = undefined
    slickEventList = undefined
    slickMethodList = [
      'slickGoTo'
      'slickNext'
      'slickPrev'
      'slickPause'
      'slickPlay'
      'slickAdd'
      'slickRemove'
      'slickFilter'
      'slickUnfilter'
      'unslick'
    ]
    slickEventList = [
      'afterChange'
      'beforeChange'
      'breakpoint'
      'destroy'
      'edge'
      'init'
      'reInit'
      'setPosition'
      'swipe'
      'lazyLoaded'
      'lazyLoadError'
    ]
    {
      scope:
        settings: '='
        enabled: '@'
        accessibility: '@'
        adaptiveHeight: '@'
        autoplay: '@'
        autoplaySpeed: '@'
        arrows: '@'
        asNavFor: '@'
        appendArrows: '@'
        prevArrow: '@'
        nextArrow: '@'
        centerMode: '@'
        centerPadding: '@'
        cssEase: '@'
        customPaging: '&'
        dots: '@'
        draggable: '@'
        fade: '@'
        focusOnSelect: '@'
        easing: '@'
        edgeFriction: '@'
        infinite: '@'
        initialSlide: '@'
        lazyLoad: '@'
        mobileFirst: '@'
        pauseOnHover: '@'
        pauseOnDotsHover: '@'
        respondTo: '@'
        responsive: '=?'
        rows: '@'
        slide: '@'
        slidesPerRow: '@'
        slidesToShow: '@'
        slidesToScroll: '@'
        speed: '@'
        swipe: '@'
        swipeToSlide: '@'
        touchMove: '@'
        touchThreshold: '@'
        useCSS: '@'
        variableWidth: '@'
        vertical: '@'
        verticalSwiping: '@'
        rtl: '@'
      restrict: 'AE'
      link: (scope, element, attr) ->
        #hide slider
        angular.element(element).css 'display', 'none'
        options = undefined
        initOptions = undefined
        destroy = undefined
        init = undefined
        destroyAndInit = undefined
        currentIndex = undefined

        initOptions = ->
          options = angular.extend(angular.copy(slickCarouselConfig), {
            enabled: scope.enabled != 'false'
            accessibility: scope.accessibility != 'false'
            adaptiveHeight: scope.adaptiveHeight == 'true'
            autoplay: scope.autoplay == 'true'
            autoplaySpeed: if scope.autoplaySpeed != null then parseInt(scope.autoplaySpeed, 10) else 3000
            arrows: scope.arrows != 'false'
            asNavFor: if scope.asNavFor then scope.asNavFor else undefined
            appendArrows: if scope.appendArrows then angular.element(scope.appendArrows) else angular.element(element)
            prevArrow: if scope.prevArrow then angular.element(scope.prevArrow) else undefined
            nextArrow: if scope.nextArrow then angular.element(scope.nextArrow) else undefined
            centerMode: scope.centerMode == 'true'
            centerPadding: scope.centerPadding or '50px'
            cssEase: scope.cssEase or 'ease'
            customPaging: if attr.customPaging then ((slick, index) ->
              scope.customPaging
                slick: slick
                index: index
            ) else undefined
            dots: scope.dots == 'true'
            draggable: scope.draggable != 'false'
            fade: scope.fade == 'true'
            focusOnSelect: scope.focusOnSelect == 'true'
            easing: scope.easing or 'linear'
            edgeFriction: scope.edgeFriction or 0.15
            infinite: scope.infinite != 'false'
            initialSlide: parseInt(scope.initialSlide) or 0
            lazyLoad: scope.lazyLoad or 'ondemand'
            mobileFirst: scope.mobileFirst == 'true'
            pauseOnHover: scope.pauseOnHover != 'false'
            pauseOnDotsHover: scope.pauseOnDotsHover == 'true'
            respondTo: if scope.respondTo != null then scope.respondTo else 'window'
            responsive: scope.responsive or undefined
            rows: if scope.rows != null then parseInt(scope.rows, 10) else 1
            slide: scope.slide or ''
            slidesPerRow: if scope.slidesPerRow != null then parseInt(scope.slidesPerRow, 10) else 1
            slidesToShow: if scope.slidesToShow != null then parseInt(scope.slidesToShow, 10) else 1
            slidesToScroll: if scope.slidesToScroll != null then parseInt(scope.slidesToScroll, 10) else 1
            speed: if scope.speed != null then parseInt(scope.speed, 10) else 300
            swipe: scope.swipe != 'false'
            swipeToSlide: scope.swipeToSlide == 'true'
            touchMove: scope.touchMove != 'false'
            touchThreshold: if scope.touchThreshold then parseInt(scope.touchThreshold, 10) else 5
            useCSS: scope.useCSS != 'false'
            variableWidth: scope.variableWidth == 'true'
            vertical: scope.vertical == 'true'
            verticalSwiping: scope.verticalSwiping == 'true'
            rtl: scope.rtl == 'true'
          }, scope.settings)
          return

        destroy = ->
          slickness = angular.element(element)
          if slickness.hasClass('slick-initialized')
            slickness.remove 'slick-list'
            slickness.slick 'unslick'
          slickness

        init = ->
          initOptions()
          slickness = angular.element(element)
          if angular.element(element).hasClass('slick-initialized')
            if options.enabled
              return slickness.slick('getSlick')
            else
              destroy()
          else
            if !options.enabled
              return
            # Event
            slickness.on 'init', (event, slick) ->
              if typeof options.event.init != 'undefined'
                options.event.init event, slick
              if typeof currentIndex != 'undefined'
                return slick.slideHandler(currentIndex)
              return
            $timeout ->
              angular.element(element).css 'display', 'block'
              slickness.not('.slick-initialized').slick options
              return
          scope.internalControl = options.method or {}
          # Method
          slickMethodList.forEach (value) ->

            scope.internalControl[value] = ->
              args = undefined
              args = Array::slice.call(arguments)
              args.unshift value
              slickness.slick.apply element, args
              return

            return
          # Event
          slickness.on 'afterChange', (event, slick, currentSlide) ->
            currentIndex = currentSlide
            if typeof options.event.afterChange != 'undefined'
              $timeout ->
                scope.$apply ->
                  options.event.afterChange event, slick, currentSlide
                  return
                return
            return
          slickness.on 'beforeChange', (event, slick, currentSlide, nextSlide) ->
            if typeof options.event.beforeChange != 'undefined'
              $timeout ->
                $timeout ->
                  scope.$apply ->
                    options.event.beforeChange event, slick, currentSlide, nextSlide
                    return
                  return
                return
            return
          slickness.on 'reInit', (event, slick) ->
            if typeof options.event.reInit != 'undefined'
              $timeout ->
                scope.$apply ->
                  options.event.reInit event, slick
                  return
                return
            return
          if typeof options.event.breakpoint != 'undefined'
            slickness.on 'breakpoint', (event, slick, breakpoint) ->
              $timeout ->
                scope.$apply ->
                  options.event.breakpoint event, slick, breakpoint
                  return
                return
              return
          if typeof options.event.destroy != 'undefined'
            slickness.on 'destroy', (event, slick) ->
              $timeout ->
                scope.$apply ->
                  options.event.destroy event, slick
                  return
                return
              return
          if typeof options.event.edge != 'undefined'
            slickness.on 'edge', (event, slick, direction) ->
              $timeout ->
                scope.$apply ->
                  options.event.edge event, slick, direction
                  return
                return
              return
          if typeof options.event.setPosition != 'undefined'
            slickness.on 'setPosition', (event, slick) ->
              $timeout ->
                scope.$apply ->
                  options.event.setPosition event, slick
                  return
                return
              return
          if typeof options.event.swipe != 'undefined'
            slickness.on 'swipe', (event, slick, direction) ->
              $timeout ->
                scope.$apply ->
                  options.event.swipe event, slick, direction
                  return
                return
              return
          if typeof options.event.lazyLoaded != 'undefined'
            slickness.on 'lazyLoaded', (event, slick, image, imageSource) ->
              $timeout ->
                scope.$apply ->
                  options.event.lazyLoaded event, slick, image, imageSource
                  return
                return
              return
          if typeof options.event.lazyLoadError != 'undefined'
            slickness.on 'lazyLoadError', (event, slick, image, imageSource) ->
              $timeout ->
                scope.$apply ->
                  options.event.lazyLoadError event, slick, image, imageSource
                  return
                return
              return
          return

        destroyAndInit = ->
          destroy()
          init()
          return

        element.one '$destroy', ->
          destroy()
          return
        scope.$watch 'settings', ((newVal, oldVal) ->
          if newVal != null
            return destroyAndInit()
          return
        ), true

    }
]