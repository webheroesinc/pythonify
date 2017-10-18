const pybind		= require('pythonify-bind');
/*
  "Hello World".find('World')		// 6
  "Hello World".find('World', 6)	// 0
  "Hello World".find('World', 6, 7)	// -1
*/
function find(sub, start, end) {
    if (typeof sub !== 'string')
	throw TypeError("First argument must be a string");

    if (typeof start !== 'undefined' && typeof start !== 'number')
	throw TypeError("Second argument must be a number");
    if (typeof end !== 'undefined' && typeof end !== 'number')
	throw TypeError("Third argument must be a number");
	
    return this.slice(start, end).indexOf( sub );
}
find.symbol		= pybind.symbol;

pybind(String.prototype, 'find', find);

module.exports		= find;
