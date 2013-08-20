var test = require('tape'),
    events = require('./');

function trigger(el) {
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

        trigger(el);
        t.ok(called, 'handler should be called');
        t.end();
    });

    t.test('remove event listener', function(t) {
        var el = document.createElement('div'),
            called = false;
        events(el)
            .on('test', function() { called = true; })
            .remove();
        trigger(el);

        t.notOk(called, 'handler should not be called after it is removed');
        t.end();
    });

    t.test('multiple elements', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            c = document.createElement('div'),
            called = 0;
        events(a, [b, c]).on('test', function() { called++; });
        trigger(a);
        trigger(b);
        trigger(c);

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
        trigger(el);
        trigger(el);

        t.equal(called, 1);
        t.end();
    });

    t.test('remove handler before it is called', function(t) {
        var el = document.createElement('div'),
            called = false;
        events(el)
            .once('test', function() { called = true; })
            .remove();
        trigger(el);

        t.notOk(called, 'handler should not be called');
        t.end();
    });

    t.test('multiple elements', function(t) {
        var a = document.createElement('div'),
            b = document.createElement('div'),
            called = 0;
        events(a, b).once('test', function() { called++; });
        trigger(b);
        trigger(a);

        t.equal(called, 1);
        t.end();
    });

    t.end();
});