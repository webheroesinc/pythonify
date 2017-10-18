const pybind		= require('pythonify-bind');
/*
  "Hello\tWorld"[py].expandtabs()	// "Hello   World"
  "Hello\tWorld"[py].expandtabs(7)	// "Hello  World"
  "Hello\tWorld"[py].expandtabs(4)	// "Hello   World"
*/
function replaceAt(index, str, length) {
    if (typeof index !== 'number')
	throw TypeError("First argument must be a number");
    
    if (typeof str !== 'string')
	throw TypeError("Second argument must be a string");

    length		= length ? length : 1;
    
    if (typeof length !== 'number')
	throw TypeError("Third argument must be a number");
    
    let i		= index-1;
    return this.substring(0,i)+str+this.substring(i+length);
}

function expandtabs(tabsize) {
    tabsize		= tabsize === undefined ? 8 : tabsize;
    
    if (typeof tabsize !== 'number')
	throw TypeError("First argument must be a number");

    return this.split("\n").map(function(line) {
	while(true) {
	    let i	= line.indexOf("\t");
	    if (i === -1) break;
            var line	= replaceAt.call( line, i+1, " ".repeat(tabsize - (i % tabsize)) );
	}
	return line;
    }).join("\n");
}
expandtabs.symbol	= pybind.symbol;

pybind(String.prototype, 'expandtabs', expandtabs);

module.exports		= expandtabs;
