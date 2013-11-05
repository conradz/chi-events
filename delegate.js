'use strict';

var matches = require('chi-matches');

module.exports = DelegateEvents;

function DelegateEvents(parent, filter) {
    this.parent = parent;
    this.filter = filter;
}

DelegateEvents.prototype.on = function(event, handler) {
    return this.parent.on(event, wrap(this.filter, handler));
};

DelegateEvents.prototype.once = function(event, handler) {
    var ref;
    function handle(e) {
        /*jshint validthis: true */
        ref.remove();
        return handler.call(this, e);
    }

    ref = this.on(event, handle);
    return ref;
};

function getFilter(filter) {
    if (typeof filter === 'function') {
        return filter;
    }

    return function(node) {
        return matches(node, filter);
    };
}

function wrap(filter, handler) {
    filter = getFilter(filter);

    function walk(parent, node, e) {
        if (parent === node) {
            return;
        } else if (filter(node)) {
            return handler.call(node, e);
        } else if (node.parentNode) {
            return walk(parent, node.parentNode, e);
        }
    }

    function wrapper(e) {
        /*jshint validthis: true */
        return walk(this, e.target, e);
    }

    return wrapper;
}
