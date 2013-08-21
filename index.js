var flatten = require('flatten-list'),
    document = window.document;

function on(nodes, event, handler) {
    nodes.forEach(function(node) {
        node.addEventListener(event, handler, false);
    });

    return {
        remove: function() { remove(nodes, event, handler); }
    };
}

function remove(nodes, event, handler) {
    nodes.forEach(function(node) {
        node.removeEventListener(event, handler, false);
    });
}

function once(nodes, event, handler) {
    var listener;

    listener = on(nodes, event, function(e) {
        listener.remove();
        handler.call(this, e);
    });

    return listener;
}

function trigger(nodes, event, detail) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(event, true, true, detail);
    nodes.forEach(function(node) {
        node.dispatchEvent(e);
    });
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

function events() {
    return new Events(flatten(arguments));
}

module.exports = events;