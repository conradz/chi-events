function flatten(value) {
    var items = [];

    function add(value) {
        if (value && typeof value.length === 'number') {
            for (var i = 0; i < value.length; i++) {
                add(value[i]);
            }
        } else {
            items.push(value);
        }
    }

    add(value);
    return items;
}

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

function Events(nodes) {
    this.nodes = nodes;
}

Events.prototype.on = function(event, handler) {
    return on(this.nodes, event, handler);
};

Events.prototype.once = function(event, handler) {
    return once(this.nodes, event, handler);
};

function events() {
    return new Events(flatten(arguments));
}

module.exports = events;