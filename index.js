var utils = require('reactive/lib/utils')

module.exports = plugin

function plugin (instance) {
  if (instance == null || typeof instance.bind !== 'function')
    throw new Error('Requires Reactive instance')

  instance.bind('data-remove', plugin.binding)
}

plugin.binding = function (el, expr) {
  if (isFalse(expr)) return

  var reactive = this.reactive
    , binding = this
    , isBool = expr=='true'
    , hasInterpolation = !isBool && utils.hasInterpolation(expr)

  update()

  // subscribe to changes
  if (hasInterpolation) {
    utils.interpolationProps(expr).forEach(function(prop){
      reactive.sub(prop, update)
    })
  } else if (!isBool) {
    // expr is a property name
    reactive.sub(expr, update)
  }

  function update(){
    var place = binding.placeholder
      , parent = el.parentNode
      , remove = true

    // hack for childview of an each-binding,
    // where the Reactive instance is created 
    // before inserting into DOM (so it has
    // no parentNode at this point).
    if (!parent && !place) {
      binding.loops = (binding.loops || 0) + 1
      if (binding.loops<15) setTimeout(update, 100)
      return 
    }

    delete binding.loops
    
    if (hasInterpolation) {
      // todo: make it work with binding.interpolate()
      var thruthy = utils.interpolate(expr, function(prop, fn){
        if (fn) return fn(reactive)
        else return reactive.get(prop)
      })
      remove = !isFalse(thruthy)
    } else if (!isBool) {
      // property name
      remove = !isFalse(binding.value(expr))
    }

    if (place) {
      if (remove) return
      // reinsert
      place.parentNode.replaceChild(el, place)
      delete binding.placeholder
    } else if (remove) {
      // remove
      binding.placeholder = document.createTextNode('')
      parent.replaceChild(binding.placeholder, el)
    }
  }
}

function isFalse(val) {
  return !val || val==='false' || val==='undefined'
}