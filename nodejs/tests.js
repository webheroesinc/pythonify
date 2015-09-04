
var py		= require('./pythonify');
py.bind();

(function(window, py) {
    console.log("Running tests...");

    passes = 0;
    function assert(condition, message) {
        if (!condition) {
	    var text	= message || "Assertion failed: test "+passes+" | caught errors: "+caught_errors;
	    console.log(text);
        }
        passes++;
    }
    caught_errors = 0;
    function catch_error(callback, expected) {
        var error	= "";
        try {
            callback();
        }
        catch(err) {
            error	= err;
        }
        assert( error.startswith(expected) === true );
        caught_errors++;
    }

    var l	= ['single', 'girls', 'your', 'mom'];
    l.append('testing')
    assert( l.pop() == 'testing' )
    assert( l.pop(0) == 'single' )
    assert( l.pop(1) == 'your' )
    assert( len(l) == 2 )

})(global, py);
