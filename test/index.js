var rm = require('../')
  , test = require('tape')
  , reactive = require('reactive')

test('exports', function(t){
  t.equal(typeof rm, 'function', 'a function')
  t.throws(rm, Error, 'requires a reactive instance')
  t.equal(typeof rm.binding, 'function', 'binding fn')
  t.end()
})

test('string boolean', function(t){
  t.ok(expr('true'))
  t.notOk(expr('false'))
  t.notOk(expr(''))
  t.end()
})

test('properties', function(t){
  t.ok(expr('rm', { rm: function(){ return true }}))
  t.notOk(expr('rm', { rm: function(){ return false }}))
  t.ok(expr('rm', { rm: true }))
  t.notOk(expr('rm', { rm: false }))
  t.ok(expr('rm.deep', { rm: {deep: true }}))
  t.end()
})

test('expressions', function(t){
  var hank = { name: 'hank' }

  t.ok(expr("{name == 'hank'}", hank))
  t.ok(expr("{name}", hank))
  t.notOk(expr("{name == 'larry'}", hank))
  t.notOk(expr("{color}", hank))

  t.end()
})

test('reactive', function(t){
  var expr = "{name == 'larry'}"
  var tpl = '<div><p data-remove="'+expr+'">{name}</p></div>'
  
  var larry = { name: 'not yet larry' }
  var r = create(tpl, larry)

  t.equal(r.el.children.length, 1)
  r.set('name', 'larry')
  t.equal(r.el.children.length, 0)
  t.end()
})

test('reinsert', function(t){
  var tpl = '<div><p data-remove="rm"></p></div>'
  var model = { rm: true }
  var r = create(tpl, model)
  t.equal(r.el.children.length, 0)
  r.set('rm', false)
  t.equal(r.el.children.length, 1)
  r.set('rm', true)
  t.equal(r.el.children.length, 0)
  t.end()
})

test('maintain order', function(t){
  var tpl = 
    '<div>' +
      '<p data-remove="rm1">1</p>' +
      '<p data-remove="rm2">2</p>' +
      '<p data-remove="rm3">3</p>' +
    '</div>'

  var model = { rm1: false, rm2: true, rm3: false }
  var r = create(tpl, model)
  t.equal(r.el.textContent, '13')
  r.set('rm1', true)
  r.set('rm2', false)
  r.set('rm1', false)
  t.equal(r.el.textContent, '123')
  t.end()
})

test('with each binding', function(t){
  var expr = "{name == 'larry'}"
  var tpl = '<div><p each="items" data-remove="'+expr+'">{name}</p></div>'
  var model = { items: [
    { name: 'hank'  },
    { name: 'larry' },
    { name: 'paula' }
  ]}

  var r = create(tpl, model)
  setTimeout(function(){
    t.equal(r.el.children.length, 2)
    t.end()
  }, 1000)
})

function expr(expr, model) {
  var tpl = '<div><p data-remove="'+expr+'">{name}</p></div>'
  var r = create(tpl, model || {})
  var removed = r.el.children.length == 0
  return removed
}

function create (tpl, model) {
  var r = reactive(tpl, model, {
    bindings: {
      'data-remove': rm.binding
    }
  })
  // r.use(rm)
  return r
}