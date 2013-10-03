// Fix bug that occurs in at least IE 9 and 10
// Some newly-created nodes will not fire events until they are added to an
// element. After they are added to an element, they will work even after they
// are removed.
//
// The fix is to create an empty container element. Before triggering an event
// on any element that does not have a parent, add the element to the container
// and immediately remove it.
//

var forEach = require('mout/array/forEach'),
    document = window.document;

module.exports = {
    check: check,
    fix: fix
};

function check(trigger) {
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

function fix(trigger) {
    var container = document.createElement('div');

    function fixedTrigger(nodes, event) {
        // Initialize the nodes by adding and removing the nodes from the
        // container
        forEach(nodes, function(node) {
            if (node.parentNode === null) {
                container.appendChild(node);
                container.removeChild(node);
            }
        });

        return trigger(nodes, event);
    }

    return fixedTrigged;
}
