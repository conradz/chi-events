# chi-events

[![NPM](https://nodei.co/npm/chi-events.png?compact=true)](https://nodei.co/npm/chi-events/)

[![Build Status](https://drone.io/github.com/conradz/chi-events/status.png)](https://drone.io/github.com/conradz/chi-events/latest)
[![Dependency Status](https://gemnasium.com/conradz/chi-events.png)](https://gemnasium.com/conradz/chi-events)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/chi-events.svg)](https://saucelabs.com/u/chi-events)

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
// Triggers the 'click' event
events(button).trigger('click');

// Use multiple DOM nodes
events(document.querySelectorAll('a')).on('click', function(e) {
    e.preventDefault();
});

// Use event delegation to listen for events on child nodes
events(container)
    .children('button') // Can use CSS selector or function
    .on('click', function() {
        // `this` is the button element
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

### `#trigger(event)`

Creates an event with the event name `event` and dispatches the event to all the
DOM nodes.

### `#children(filter)`

Returns a new object that can be used to listen to events that occur in the
children of the nodes. The returned object contains the `#on` and `#once`
methods that have the same usage, but use event delegation to listen only for
events that occur in child nodes that match `filter`. `filter` can be a CSS
selector string or a function that takes a node and returns a truthy value if
events on that node should be handled.

The context (the `this` object) in any attached event handlers will be the node
that the event bubbled from that matches `filter`.

Note that since this listens for bubbled events, it will include child nodes
that are added after the event listener has been attached.
