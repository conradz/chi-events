# chi-events

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