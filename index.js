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

function createEvent(event) {
    var e = document.createEvent('Event');
    e.initEvent(event, true, true);
    return e;
}

function trigger(nodes, event) {
    var e = createEvent(event);
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

// Fix bug that occurs in at least IE 9 and 10
// Some newly-created nodes will not fire events until they are added to an
// element. After they are added to an element, they will work even after they
// are removed.
//
// The fix is to create an empty container element. Before triggering an event
// on any element that does not have a parent, add the element to the container
// and immediately remove it.
function checkTriggerBug() {
    var a = document.createElement('div'),
        called = false;

    // Check if click event works on new DOM element
    a.addEventListener('click', function() { called = true; }, false);
    trigger([a], 'click');
    if (called) {
        return false;
    }

    // Check if event works on element after it is added to another
    var b = document.createElement('div');
    b.appendChild(a);
    trigger([a], 'click');

    // If it works now, it has the bug
    return called;
}

function fixTrigger() {
    var container = document.createElement('div');

    function trigger(nodes, event) {
        var e = createEvent(event);
        nodes.forEach(function(node) {
            if (node.parentNode === null) {
                container.appendChild(node);
                container.removeChild(node);
            }

            node.dispatchEvent(e);
        });
    }

    return trigger;
}

if (checkTriggerBug()) {
    trigger = fixTrigger();
}