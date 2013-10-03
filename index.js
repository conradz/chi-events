var flatten = require('flatten-list'),
    forEach = require('mout/array/forEach'),
    ieBug = require('./ie-bug'),
    document = window.document;

if (ieBug.check(trigger)) {
    trigger = ieBug.fix(trigger);
}

module.exports = events;
function events() {
    return new Events(flatten(arguments));
}

function Events(nodes) {
    this.nodes = nodes;
}

Events.prototype.on = function(event, handler) {
    return on(this.nodes, event, handler);
};

Events.prototype.once = function(event, handler) {
    return once(this.nodes, event, handler);
};

Events.prototype.trigger = function(event, detail) {
    return trigger(this.nodes, event, detail);
};

function on(nodes, event, handler) {
    forEach(nodes, function(node) {
        node.addEventListener(event, handler, false);
    });

    function removeListener() {
        remove(nodes, event, handler);
    }

    return {
        remove: removeListener
    };
}

function remove(nodes, event, handler) {
    forEach(nodes, function(node) {
        node.removeEventListener(event, handler, false);
    });
}

function once(nodes, event, handler) {
    var listener;
    function onceHandler(e) {
        listener.remove();
        handler.call(this, e);
    }

    listener = on(nodes, event, onceHandler);
    return listener;
}

function trigger(nodes, event) {
    var e = createEvent(event);
    forEach(nodes, function(node) {
        node.dispatchEvent(e);
    });
}

function createEvent(event) {
    var e = document.createEvent('Event');
    e.initEvent(event, true, true);
    return e;
}
