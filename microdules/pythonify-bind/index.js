/*
  "tests\t\t- Run the tests".expandtabs()

  "tests\t\t- Run the tests"[py].expandtabs()
  "tests\t\t- Run the tests".py.expandtabs()

  "tests\t\t- Run the tests"[py.expandtabs]()
  Py("tests\t\t- Run the tests").expandtabs()

  Py.expandtabs("tests\t\t- Run the tests")
  "tests\t\t- Run the tests".Py('expandtabs')()
*/
function pybind(object, name, method) {
    const py			= pybind.symbol;
    const pi			= Symbol.for('pythonify-internal');

    if ( object[pi] === undefined )
	object[pi]		= {};

    if ( object[py] === undefined ) {
	// Runs one time on the object
	Object.defineProperty(object, py, {
	    get: function() {
		object[pi][py]	= this;
		return object[pi];
	    }
	});
    }
    
    Object.defineProperty(object[py], name, {
	get: function() {
	    function pythonify() {
		// Pythonify - rescoping submethod to use parent context.
		return method.apply(object[pi][py], arguments);
	    }
	    pythonify.source	= method;
	    return pythonify;
	}
    });

}
pybind.symbol			= Symbol.for('pythonify');
module.exports			= pybind;
