# reactive-rm

Plugin for [reactive](https://github.com/component/reactive) to conditionally remove (or reinsert) an element. Order is maintained.

> Jump to: [Usage](#usage) - [Example](#example) - [Install](#install) - [License](#license)

[![Build Status](https://travis-ci.org/vweevers/reactive-rm.svg)](https://travis-ci.org/vweevers/reactive-rm)

## Usage

Add an attribute to the element: `data-remove="expression"`, where `expression` is either a:

- string boolean (`"true"` or `"false"`)
- model property name
- javascript expression (interpolated).

If thruthy, the element is removed. If falsy, the element is reinserted.

Regarding use together with the `each` binding (on the same element): a mutating array will likely cause problems. Either let `each` handle element removal (recommended) or use an immutable array. 

## Example

```html
<p data-remove="false">hey now</p>
<p data-remove="removeMe">hey now</p>
<p data-remove="{ name == 'hank'}">removed</p>
```

```js
var reactive = require('reactive')
  , rm = require('reactive-rm')

var model = {
  name: 'hank',
  removeMe: function() { return false }
}

reactive(template, model, {
  bindings: {
    'data-remove': rm.binding
  }
})
```

Note, the standard method for loading plugins, `view.use(plugin)`, will not work (currently). This is due to attributes being interpolated by reactive, after which the plugin can't subscribe to changes.

## Install

    npm i reactive-rm

Then use [browserify](http://browserify.org/) to bundle for the browser.

## License

[MIT](http://opensource.org/licenses/MIT) © [Vincent Weevers](http://vincentweevers.nl)
