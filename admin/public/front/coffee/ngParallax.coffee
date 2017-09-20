'use strict'
if typeof module != 'undefined' and typeof exports != 'undefined' and module.exports == exports
  module.exports = 'ngParallax'
angular.module 'ngParallax', []
angular.module('ngParallax').directive 'ngParallax', [
  '$timeout'
  ($window, $timeout) ->
    {
      restrict: 'AE'
      scope:
        pattern: '='
        speed: '='
      link: (scope, elem, attr) ->

        execute = ->
          scrollTop = if window.pageYOffset != undefined then window.pageYOffset else (document.documentElement or document.body.parentNode or document.body).scrollTop
          speed = scrollTop / scope.speed
          if isMobile
            speed = speed * .10
          if speed == 0
            bgObj.style.backgroundPosition = '0% ' + 0 + '%'
          else
            bgObj.style.backgroundPosition = '0% ' + speed + '%'
          return

        window.mobileAndTabletcheck = ->
          navigator.userAgent.match(/Android/i) or navigator.userAgent.match(/webOS/i) or navigator.userAgent.match(/iPhone/i) or navigator.userAgent.match(/iPad/i) or navigator.userAgent.match(/iPod/i) or navigator.userAgent.match(/BlackBerry/i) or navigator.userAgent.match(/Windows Phone/i)

        bgObj = elem[0]
        bgObj.style.height = '100%'
        bgObj.style.margin = '0 auto'
        bgObj.style.position = 'relative'
        bgObj.style.background = 'url(' + scope.pattern + ')'
        bgObj.style.backgroundAttachment = 'fixed'
        bgObj.style.backgroundRepeat = 'repeat'
        bgObj.style.backgroundSize = 'cover'
        isMobile = window.mobileAndTabletcheck()
        # for mobile
        window.document.addEventListener 'touchmove', ->
          execute()
          return
        # for browsers
        window.document.addEventListener 'scroll', ->
          execute()
          return
        execute()
        return

    }
]