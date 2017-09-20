((root, factory) ->
  if typeof define == 'function' and define.amd
    define ->
      factory root
  else if typeof exports == 'object'
    module.exports = factory
  else
    root.Wew = factory(root)
  return
) this, (root) ->
  'use strict'

  Animate = (userOptions) ->
    el = root.document.createElement('fakeelement')
    defaultOptions = 
      animatedClass: 'js-animated'
      animateLibClass: 'animated'
      offset: 0
      target: '.wew'
      keyword: 'wew'
      reverse: false
      debug: false
      onLoad: true
      onScroll: true
      onResize: false
      callbackOnInit: ->
      callbackOnAnimate: ->
    @throttledEvent = @_debounce((->
      @render()
      return
    ).bind(this), 15)
    @supports = 'querySelector' of root.document and 'addEventListener' of root and 'classList' of el
    @options = @_extend(defaultOptions, userOptions or {})
    @elements = root.document.querySelectorAll(@options.target)
    @initialised = false
    return

  Animate::_debounce = (func, wait, immediate) ->
    timeout = undefined
    ->
      context = this
      args = arguments

      later = ->
        timeout = null
        if !immediate
          func.apply context, args
        return

      callNow = immediate and !timeout
      clearTimeout timeout
      timeout = setTimeout(later, wait)
      if callNow
        func.apply context, args
      return

  Animate::_extend = ->
    extended = {}
    length = arguments.length

    merge = (obj) ->
      for prop of obj
        extended[prop] = obj[prop]
      return

    i = 0
    while i < length
      obj = arguments[i]
      if @_isType('Object', obj)
        merge obj
      else
        console.error 'Custom options must be an object'
      i++
    extended

  Animate::_whichAnimationEvent = ->
    t = undefined
    el = root.document.createElement('fakeelement')
    animations = 
      'animation': 'animationend'
      'OAnimation': 'oAnimationEnd'
      'MozAnimation': 'animationend'
      'WebkitAnimation': 'webkitAnimationEnd'
    for t of animations
      `t = t`
      if el.style[t] != undefined
        return animations[t]
    return

  Animate::_getElemDistance = (el) ->
    location = 0
    if el.offsetParent
      loop
        location += el.offsetTop
        el = el.offsetParent
        unless el
          break
    if location >= 0 then location else 0

  Animate::_getElemOffset = (el) ->
    # Get element offset override
    elOffset = parseFloat(el.getAttribute('data-' + @options.keyword + '-offset'))
    if !isNaN(elOffset)
      # If elOffset isn't between 0 and 1, round it up or down
      if elOffset <= 1
        if elOffset < 0
          elOffset = 0
        return Math.max(el.offsetHeight * elOffset)
      else
        return elOffset
    else if !isNaN(@options.offset)
      if @options.offset <= 1
        return Math.max(el.offsetHeight * @options.offset)
      else
        return @options.offset
    return

  Animate::_getScrollPosition = (position) ->
    if position == 'bottom'
      Math.max (root.scrollY or root.pageYOffset) + (root.innerHeight or root.document.documentElement.clientHeight)
    else
      root.scrollY or root.pageYOffset

  Animate::_isInView = (el) ->
    hasEntered = (->
      if @_getScrollPosition('bottom') > @_getElemDistance(el) + @_getElemOffset(el) then true else false
    ).bind(this)
    hasLeft = (->
      if @_getScrollPosition('top') > @_getElemDistance(el) + @_getElemOffset(el) then true else false
    ).bind(this)
    if hasEntered() & !hasLeft() then true else false

  Animate::_isVisible = (el) ->
    if true then el.style.visibility == 'visible' else ''

  Animate::_hasAnimated = (el) ->
    animated = el.getAttribute('data-animated')
    if true then animated == 'true' else ''

  Animate::_isType = (type, obj) ->
    test = Object::toString.call(obj).slice(8, -1)
    obj != null and obj != undefined and test == type

  Animate::_addAnimation = (el) ->
    animations = el.className.split(' ')
    animations.push @options.animateLibClass
    if el.getAttribute('data-' + @options.keyword + '-duration')
      el.style.animationDuration = el.getAttribute('data-' + @options.keyword + '-duration')
    if el.getAttribute('data-' + @options.keyword + '-delay')
      el.style.animationDelay = el.getAttribute('data-' + @options.keyword + '-delay')
    el.className = ''
    setTimeout (->
      if @options.debug and root.console.debug
        console.debug 'Animation added'
      el.setAttribute 'data-visibility', true
      el.style.visibility = 'visible'
      animations.forEach (animation) ->
        el.classList.add animation
        return
      return
    ).bind(this), 1
    @_completeAnimation el
    return

  Animate::_removeAnimation = (el) ->
    el.setAttribute 'data-visibility', false
    el.removeAttribute 'data-animated'
    el.style.visibility = 'hidden'
    el.classList.remove @options.animateLibClass
    return

  Animate::_completeAnimation = (el) ->
    animationEvent = @_whichAnimationEvent()
    el.addEventListener animationEvent, (->
      if @options.debug and root.console.debug
        console.debug 'Animation completed'
      removeOveride = el.getAttribute('data-' + @options.keyword + '-remove')
      el.classList.add @options.animatedClass
      el.setAttribute 'data-animated', true
      if @options.callbackOnAnimate and @_isType('Function', @options.callbackOnAnimate)
        @options.callbackOnAnimate el
      else
        console.error 'Callback is not a function'
      return
    ).bind(this)
    return

  Animate::init = ->
    if @options.debug and root.console.debug
      console.debug 'Animate.js successfully initialised. Found ' + @elements.length + ' elements to animate'
    if !@supports
      return
    if @options.onLoad
      root.document.addEventListener 'DOMContentLoaded', (->
        @render()
        return
      ).bind(this)
    if @options.onResize
      root.addEventListener 'resize', @throttledEvent, false
    if @options.onScroll
      root.addEventListener 'scroll', @throttledEvent, false
    if @options.callbackOnInit and @_isType('Function', @options.callbackOnInit)
      @options.callbackOnInit()
    else
      console.error 'Callback is not a function'
    els = @elements
    i = els.length - 1
    while i >= 0
      el = els[i]
      if !@_isInView(el)
        el.style.visibility = 'hidden'
        el.setAttribute 'data-visibility', false
      i--
    @initialised = true
    return

  Animate::kill = ->
    if @options.debug and root.console.debug
      console.debug 'Animation.js nuked'
    if !@initialised
      return
    if @options.onResize
      root.removeEventListener 'resize', @throttledEvent, false
    if @options.onScroll
      root.removeEventListener 'scroll', @throttledEvent, false
    @options = null
    @initialised = false
    return

  Animate::render = ->
    els = @elements
    i = els.length - 1
    while i >= 0
      el = els[i]
      reverseOveride = el.getAttribute('data-animation-reverse')
      if @_isInView(el)
        if !@_isVisible(el)
          @_addAnimation el
      else if @_hasAnimated(el)
        if reverseOveride != 'false' and @options.reverse
          @_removeAnimation el
      i--
    return

  Animate