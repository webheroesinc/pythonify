const pybind		= require('./index.js');
const py		= pybind.symbol;

function repeat(str, n) {
    return n<=0 ? '' : new Array(n+1).join(str);
}
function rjust(str, w, fchar) {
    var fchar		= fchar ? fchar : " ";
    return repeat(fchar, w-str.length )+str;
}
function zfill(str, w) {
    var sign		= str.startsWith('-');
    return (sign ? '-' : '') + rjust(str, sign ? w-1 : w, '0' );
}

function end(hrtime) {
    let endtime		= process.hrtime();
    console.log(       "Comparing hr times:	", endtime);
    console.log(       "			", hrtime);
    let seconds		= endtime[0] - hrtime[0];
    let nanos		= endtime[1] - hrtime[1];
    if (nanos < 0) {
	seconds--;
	nanos		= nanos+1e9;
    }
    console.log("Benchmark	", seconds+'.'+zfill(String(nanos), 9), "seconds");
    console.log(repeat("-", 100));
}

pybind.strip			= Symbol.for('pythonify.strip');
pybind.stripbind		= Symbol.for('pythonify.stripbind');
pybind.stripclosure		= Symbol.for('pythonify.strip.closure');
pybind.stripbindclosure		= Symbol.for('pythonify.stripbind.closure');

String.prototype[pybind.strip]		= String.prototype.trim;
Object.defineProperty(String.prototype, pybind.stripbind, {
    value: String.prototype.trim,
});

String.prototype[pybind.stripclosure]	= function() { return this.trim() };
Object.defineProperty(String.prototype, pybind.stripbindclosure, {
    value: function() { return this.trim(); },
});

pybind(String.prototype, 'strip', String.prototype.trim);
Object.defineProperty(String.prototype, "strip", {
    value: String.prototype.trim,
});


var iterations		= 1e6;

/*
  Simple method benchmark tests
*/

console.log();
console.log('Baseline tests using "".trim()');
console.log();

// Set baseline with native trim()
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing "".trim()			[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    ".trim() === "hey hey hey";
    i++;
}
end(start);

// pybind() method
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py].strip()			[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[py].strip() === "hey hey hey";
    i++;
}
end(start);

// Globally attached to String.prototype
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing "".strip()			[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    ".strip() === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.strip]()			[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.strip]() === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.stripbind]()		[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.stripbind]() === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.stripclosure]()		[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.stripclosure]() === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.stripbindclosure]()	[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.stripbindclosure]() === "hey hey hey";
    i++;
}
end(start);



/*
  Complex method benchmark tests
*/

function center(w, fchar) {
    var l		= this.length;
    if(l >= w)
	return this.slice();
    
    var fillchar	= fchar ? fchar : " ";
    var blen		= Math.ceil( (w - l)/2 );
    var elen		= Math.floor((w - l)/2 );
    var bstr		= new Array( blen + 1 ).join( fchar );
    var estr		= new Array( elen + 1 ).join( fchar );
    
    return bstr+this+estr;
}

pybind.center			= Symbol.for('pythonify.center');
pybind.centerbind		= Symbol.for('pythonify.centerbind');

String.prototype[pybind.center]		= center;
Object.defineProperty(String.prototype, pybind.centerbind, {
    value: center,
});

pybind(String.prototype, 'center', center);
Object.defineProperty(String.prototype, "center", {
    value: center,
});

console.log();
console.log("Complex tests using center()");
console.log();

// pybind() method
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py].center(100)		[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[py].center(100) === "hey hey hey";
    i++;
}
end(start);

// Globally attached to String.prototype
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing "".center(100)			[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    ".center(100) === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.center](100)		[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.center](100) === "hey hey hey";
    i++;
}
end(start);

//
var start		= process.hrtime();
var i			= 0;
console.log(   'Testing ""[py.centerbind](100)		[', i, '<', iterations, ']');
while (i < iterations) {
    "   hey hey hey    "[pybind.centerbind](100) === "hey hey hey";
    i++;
}
end(start);

// console.log(""[py].center.toString());
// console.log(""[py].center.source.toString());
