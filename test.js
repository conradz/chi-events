var test = require('tape'),
    events = require('./'),
    document = window.document;

function triggerTest(el) {
    var ev = document.createEvent('Event');
    ev.initEvent('test', true, true);
    el.dispatchEvent(ev);
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

        el.addEventListener('click', function() { called = true; }, false);
        events(el).trigger('click');

        t.ok(called, 'event should be triggered');
        t.end();
    });

    t.test('multiple nodes', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            results = [];

        function handle() {
            results.push(this);
        }
        a.addEventListener('click', handle, false);
        b.addEventListener('click', handle, false);
        events(a, b).trigger('click');

        t.deepEqual(results, [a, b]);
        t.end();
    });

    t.end();
});