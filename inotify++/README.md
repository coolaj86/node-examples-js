I created an abstraction around your inotify that is more javascript-y (and less C-y) in nature.

Here's an example of it's use:
http://github.com/coolaj86/node-examples-coolaj86/blob/master/inotify%2B%2B/inotify%2B%2B-test.js


The big bonus is that you can do this:

    var Inotify = require('./inotify++'),
        inotify;

    inotify = Inotify.create();
    inotify.watch({
        all_events: function (ev) { console.log("some things happened: " + ev.masks.toString()) },
        moved_from: function (ev) { console.log ("it was a move from on " + ev.name) },
    }, '/path/to/watch');

note that "ev.masks" is an array of strings, not a bitmask and "ev.watch"  is the path rather than the watch descriptor.
