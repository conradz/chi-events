'use strict';

var test = require('tape'),
    events = require('./'),
    create = require('chi-create'),
    document = window.document,
    body = document.body;

function triggerTest(el) {
    var e = document.createEvent('Event');
    e.initEvent('test', true, false);
    el.dispatchEvent(e);
}

test('on', function(t) {

    t.test('add event listener', function(t) {
        var el = document.createElement('div'),
            called = false;

        events(el).on('test', function(e) {
            t.equal(this, el);
            t.equal(e.target, el);
            called = true;
        });
        triggerTest(el);

        t.ok(called, 'handler should be called');
        t.end();
    });

    t.test('remove event listener', function(t) {
        var el = document.createElement('div'),
            called = false;

        events(el)
            .on('test', function() { called = true; })
            .remove();
        triggerTest(el);

        t.notOk(called, 'handler should not be called after it is removed');
        t.end();
    });

    t.test('multiple elements', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            c = document.createElement('div'),
            called = 0;

        events(a, [b, c]).on('test', function() { called++; });
        triggerTest(a);
        triggerTest(b);
        triggerTest(c);

        t.equal(called, 3);
        t.end();
    });

    t.end();
});

test('once', function(t) {

    t.test('call handler only once', function(t) {
        var el = document.createElement('div'),
            called = 0;

        events(el).once('test', function(e) {
            t.equal(this, el);
            t.equal(e.target, el);
            called++;
        });
        triggerTest(el);
        triggerTest(el);

        t.equal(called, 1);
        t.end();
    });

    t.test('remove handler before it is called', function(t) {
        var el = document.createElement('div'),
            called = false;

        events(el)
            .once('test', function() { called = true; })
            .remove();
        triggerTest(el);

        t.notOk(called, 'handler should not be called');
        t.end();
    });

    t.test('multiple elements', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            called = 0;
        events(a, b).once('test', function() { called++; });
        triggerTest(b);
        triggerTest(a);

        t.equal(called, 1);
        t.end();
    });

    t.end();
});

test('trigger', function(t) {

    t.test('trigger DOM event', function(t) {
        var el = document.createElement('div'),
            called = false;

        el.addEventListener('test', function() { called = true; }, false);
        events(el).trigger('test');

        t.ok(called, 'event should be triggered');
        t.end();
    });

    t.test('multiple nodes', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            results = [];

        function handle() {
            /*jshint validthis: true */
            results.push(this);
        }
        a.addEventListener('test', handle, false);
        b.addEventListener('test', handle, false);
        events(a, b).trigger('test');

        t.deepEqual(results, [a, b]);
        t.end();
    });

    t.end();
});

test('children', function(t) {

    function structure() {
        var el = create('div',
            create('div', { 'class': 'first' },
                create('div', { 'class': 'nested' })),
            create('div', { 'class': 'second' }));

        body.appendChild(el);
        return el;
    }

    t.test('handle events on matched children', function(t) {
        var el = structure(),
            first = el.querySelector('.first'),
            called = 0;

        events(el)
            .children(function(n) { return n === first; })
            .on('test', function(e) {
                t.equal(e.target, first);
                t.equal(this, first);
                called++;
            });

        triggerTest(first);
        body.removeChild(el);

        t.equal(called, 1);
        t.end();
    });

    t.test('walk up the tree', function(t) {
        var el = structure(),
            first = el.querySelector('.first'),
            nested = el.querySelector('.nested'),
            called = 0;

        events(el)
            .children(function(n) { return n === first; })
            .on('test', function(e) {
                t.equal(e.target, nested);
                t.equal(this, first);
                called++;
            });

        triggerTest(nested);
        body.removeChild(el);

        t.equal(called, 1);
        t.end();
    });

    t.test('skip events on unmatched children', function(t) {
        var el = structure(),
            first = el.querySelector('.first'),
            called = 0;

        events(el)
            .children(function(n) { return n !== first; })
            .on('test', function() {
                called++;
            });

        triggerTest(first);
        body.removeChild(el);

        t.equal(called, 0);
        t.end();
    });

    t.test('allow CSS selectors for matching', function(t) {
        var el = structure(),
            first = el.querySelector('.first'),
            second = el.querySelector('.second'),
            called = 0;

        events(el)
            .children('.second')
            .on('test', function() {
                t.equal(this, second);
                called++;
            });

        triggerTest(first);
        triggerTest(second);
        body.removeChild(el);

        t.equal(called, 1);
        t.end();
    });

    t.test('should handle .once', function(t) {
        var el = structure(),
            first = el.querySelector('.first'),
            second = el.querySelector('.second'),
            called = 0;

        events(el)
            .children('.second')
            .once('test', function() {
                t.equal(this, second);
                called++;
            });

        triggerTest(first);
        triggerTest(second);
        triggerTest(second);
        body.removeChild(el);

        t.equal(called, 1);
        t.end();
    });

    t.end();
});
