# chi-events

[![NPM](https://nodei.co/npm/chi-events.png?compact=true)](https://nodei.co/npm/chi-events/)

[![Build Status](https://travis-ci.org/conradz/chi-events.png?branch=master)](https://travis-ci.org/conradz/chi-events)
[![Dependency Status](https://gemnasium.com/conradz/chi-classes.png)](https://gemnasium.com/conradz/chi-classes)

Easily manage DOM events.

This module uses Node.js-style modules, for best results use
[browserify](https://github.com/substack/node-browserify).

## Example

```js
var events = require('chi-events');

var button = document.querySelector('#myButton');

// Listening for events
events(button).on('click', function(e) {
    // Handle the event
});

// Removing listeners
var listen = events(button).on('click', function() {
    listen.remove();
});

// Listening for only one event
events(button).once('click', function() {
    // Only invoked once at most
});

// Triggering an event
// Triggers the 'click' event with event.detail == 'test'
events(button).trigger('click', 'test');

// Use multiple DOM nodes
events(document.querySelectorAll('a')).on('click', function(e) {
    e.preventDefault();
});
```

## Reference

### `events(...nodes)`

Creates a new wrapper object. `nodes` can be any number of nodes or arrays of
nodes. Array can be infinitely nested. Also accepts psuedo-array objects, such
as `NodeList` objects.

### `#on(event, handler)`

Adds an event listener to all the DOM nodes. Returns an object that contains a
`remove` function that will remove the event listener from all the nodes.

### `#once(event, handler)`

Adds an event listener to all the DOM nodes. The handler function will be only
called one time at most. The first time the event is triggered, the listener
will be removed. Return value is the same as `#on`.

### `trigger(event, [detail])`

Creates an event with the event name `event` and dispatches the event to all the
DOM nodes. If `detail` is provided, the `detail` property of the event is set to
this value.