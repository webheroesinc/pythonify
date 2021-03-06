
var bunyan		= require('bunyan')
var log			= bunyan.createLogger({
    name: "Pythonify Tests",
    level: 'trace'
});

var Py			= require('../pythonify.js');
var whincutils		= require('whincutils');

var Testing		= whincutils.Testing;
var Common		= whincutils.Common;
var Promise		= whincutils.Promise;
var assert		= Testing.assert;

function namespace(fn) {
    var test		= assert.ns(fn.name);
    return function(d) {
	var P		= fn.call(test, d);
	var c		= test.count;
	log.info("Ran", c, "tests in", fn.name);
	return P || Promise.resolve(c+(d||0));
    }
}

var totalTests		= 0;
var totalGeneralTests	= 0;
var totalStringTests	= 0;
var totalNumberTests	= 0;
var totalArrayTests	= 0;
var totalObjectTests	= 0;

Promise.sequence([
    namespace(function type() {
	this( Py.type(null) === 'Null' );
	this( Py.type(undefined) === 'Undefined' );
	this( Py.type("") === 'String' );
	this( Py.type(new Object("")) === 'String' );
	this( Py.type(1) === 'Number' );
	this( Py.type(new Object(1)) === 'Number' );
	this( Py.type([]) === 'Array' );
	this( Py.type({}) === 'Object' );
    }),
    namespace(function len() {
	this( Py.len([]) === 0 );
	this( Py.len({}) === 0 );
	this( Py.len("") === 0 );
	this.exception(function() {
	    this( Py.len(1) );
	});
	this.exception(function() {
	    this( Py.len(null) );
	});
	this.exception(function() {
	    this( Py.len(undefined) );
	});
    }),
    function finishedGeneralTests(n) {
	log.info("Passed", n, "general tests without binding");
	totalGeneralTests	+= n;
	return Promise.resolve(0);
    },
    namespace(function capitalize() {
	var s	= Py("hankRoids");
	
	this( typeof s.capitalize() === 'string' );
	this( s.capitalize() === "Hankroids" );
    }),
    namespace(function repeat() {
	var s	= Py("-");
	
	this( typeof s.repeat(10) === 'string' );
	this( s.repeat(10).length === 10 );
	this( s.repeat(10) === '----------' );
	this( s.repeat(0) === '' );
	this.exception(function() {
	    s.repeat("10");
	});
    }),
    namespace(function startswith() {
	var s	= Py("This is the string!");
	
	this( typeof s.startswith('') === 'boolean' );
	this( s.startswith('This') === true );
	this( s.startswith('the') === false );
	this.exception(function() {
	    s.startswith(10);
	});
	this.exception(function() {
	    s.startswith('', '', 1);
	});
	this.exception(function() {
	    s.startswith('', 1, '');
	});
    }),
    namespace(function endswith() {
	var s	= Py("This is the string!");
	
	this( typeof s.endswith('') === 'boolean' );
	this( s.endswith('string!') === true );
	this( s.endswith('string') === false );
	this( s.endswith('is', 0, 7) === true );
	this( s.endswith('tring', 13, -1) === true );
	this.exception(function() {
	    s.endswith(10);
	});
	this.exception(function() {
	    s.endswith('', '', 1);
	});
	this.exception(function() {
	    s.endswith('', 1, '');
	});
    }),
    namespace(function center() {
	var s	= Py("Pint");

	this( typeof s.center(1) === 'string' );
	this( s.center(1) === "Pint" );
	this( s.center(20).length === 20 );
	this( s.center(20, '-') === "--------Pint--------" );
	this.exception(function() {
	    s.center("Tarzan");
	});
    }),
    namespace(function count() {
	var s	= Py("This is the string!");
	
	this( typeof s.count('i') === 'number' );
	this( s.count('i') === 3 );
	this( s.count('i', 4) === 2 );
	this( s.count('i', 4, -6) === 1 );
	this.exception(function() {
	    s.count(0);
	});
	this.exception(function() {
	    s.count('', '', 1);
	});
	this.exception(function() {
	    s.count('', 1, '');
	});
    }),
    namespace(function replaceAt() {
	var s	= Py("Hello World");
	
	this( typeof s.replaceAt(1, 'i') === 'string' );
	this( s.replaceAt(6, "@") === "Hello@World" );
	this( s.replaceAt(6, "  ") === "Hello  World" );
	this( s.replaceAt(6, "  ", 2) === "Hello  orld" );
	this( s.replaceAt(11, ".") === "Hello Worl." );
	this.exception(function() {
	    s.replaceAt('');
	});
	this.exception(function() {
	    s.replaceAt(1, 1);
	});
	this.exception(function() {
	    s.replaceAt(1, '', '');
	});
    }),
    namespace(function find() {
	var s	= Py("Hello World");
	
	this( typeof s.find('i') === 'number' );
	this( s.find('lo') === 3 );
	this( s.find('los') === -1 );
	this( s.find('l') === 2 );
	this( s.find('l', 2) === 0 );
	this( s.find('rl', 0, -2) === -1 );
	this.exception(function() {
	    s.find(1);
	});
	this.exception(function() {
	    s.find('', '');
	});
	this.exception(function() {
	    s.find('', 1, '');
	});
    }),
    namespace(function format() {
	var data	= {
	    length: 4,
	    text: 'Flappy Bird',
	    name: 'Travis'
	};
	this( Py("{0} {1}").format("Hello", "World") === "Hello World" );
	this( Py("{length} {0} {text} {1}").format("Hello", "World", data) === "4 Hello Flappy Bird World" );
	this( Py("{text} {length}").format(data) === "Flappy Bird 4" );
	this( Py("{name} {name}").format(data) === "Travis Travis" );
    }),
    namespace(function expandtabs() {
	var s	= Py("Hello\tWorld");
	
	this( typeof s.expandtabs() === 'string' );
	this( s.expandtabs() == "Hello   World" );
	this( s.expandtabs(7) == "Hello  World" );
	this( Py("  Hello\tWorld").expandtabs() == "  Hello World" );
	
	var s	= Py("  \tHello\tWorld\t");
	this( s.expandtabs() == "        Hello   World   " );
	this( s.expandtabs(4) == "    Hello   World   " );
	
	this( Py("\tHello\n\tWorld").expandtabs(4) == "    Hello\n    World" );
	this( Py("\tHello\t\n\tWorld").expandtabs(4) == "    Hello   \n    World" );
	
	this.exception(function() {
	    s.expandtabs('');
	});
    }),
    namespace(function index() {
	var s	= Py("Hello World");
	
	this( typeof s.index('llo') === 'number' );
	this( s.index("llo") == 2 );
	this( s.index("Wo", 6) == 0 );
	this( s.index("W", 6, 7) == 0 );
	this.exception(function() {
	    s.index('f');
	});
	this.exception(function() {
	    s.index('', '');
	});
	this.exception(function() {
	    s.index('', 1, '');
	});
    }),
    namespace(function join() {
	var s	= Py("_");

	this( typeof s.join("n") === 'string' );
	this( s.join("Mom") === "M_o_m");
	this( s.join([1,2,3,4]) === "1_2_3_4");
	this.exception(function() {
	    s.join(4);
	});
    }),
    namespace(function ljust() {
	var s	= Py("king");

	this( typeof s.ljust(10) === 'string' );
	this( s.ljust(10) === 'king      ' );
	this( s.ljust(0) === 'king' );
	
	this.exception(function() {
	    s.ljust('');
	});
	this.exception(function() {
	    s.ljust(10, 1);
	});
    }),
    namespace(function lower() {
	var s	= Py("GANGNAM STYLE");

	this( typeof s.lower() === 'string' );
	this( s.lower() === 'gangnam style' );
    }),
    namespace(function lstrip() {
	var s	= Py("  Strip it!  ");

	this( typeof s.lstrip() === 'string' );
	this( s.lstrip() === 'Strip it!  ' );
	this( s.lstrip(' tS') === 'rip it!  ' );

	this.exception(function() {
	    s.lstrip(10);
	});
    }),
    namespace(function partition() {
	var s	= Py("filename.txt");

	this( typeof s.partition('.') === 'object' );
	this( s.partition('.')[0] === 'filename' );
	this( s.partition('.')[1] === '.' );
	this( s.partition('.')[2] === 'txt' );

	this.exception(function() {
	    s.partition();
	});
	this.exception(function() {
	    s.partition(2);
	});
    }),
    namespace(function istitle() {
	var s		= Py("They'Re Bill'S Friends.");
	
	this( s.istitle() );
    }),
    namespace(function rfind() {
	var s	= Py("Hello World");
	
	this( typeof s.rfind('i') === 'number' );
	this( s.rfind('lo') === 3 );
	this( s.rfind('los') === -1 );
	this( s.rfind('l') === 9 );
	this( s.rfind('l', 0, -2) === 3 );
	this( s.rfind('rl', 0, -2) === -1 );
	this.exception(function() {
	    s.rfind(1);
	});
	this.exception(function() {
	    s.rfind('', '');
	});
	this.exception(function() {
	    s.rfind('', 1, '');
	});
    }),
    namespace(function rindex() {
	var s	= Py("Hello World");
	
	this( typeof s.rindex('llo') === 'number' );
	this( s.rindex("llo") == 2 );
	this( s.rindex("Wo", 6) == 0 );
	this( s.rindex("W", 6, 7) == 0 );
	this.exception(function() {
	    s.rindex('f');
	});
	this.exception(function() {
	    s.rindex('', '');
	});
	this.exception(function() {
	    s.rindex('', 1, '');
	});
    }),
    namespace(function rpartition() {
	var s	= Py("file.name.txt");

	this( typeof s.rpartition('.') === 'object' );
	this( s.rpartition('.')[0] === 'file.name' );
	this( s.rpartition('.')[1] === '.' );
	this( s.rpartition('.')[2] === 'txt' );

	this.exception(function() {
	    s.rpartition();
	});
	this.exception(function() {
	    s.rpartition(2);
	});
    }),
    namespace(function rjust() {
	var s	= Py("king");

	this( typeof s.rjust(10) === 'string' );
	this( s.rjust(10) === '      king' );
	this( s.rjust(0) === 'king' );
	
	this.exception(function() {
	    s.rjust('');
	});
	this.exception(function() {
	    s.rjust(10, 1);
	});
    }),
    namespace(function rstrip() {
	var s	= Py("  Strip it!  ");

	this( typeof s.rstrip() === 'string' );
	this( s.rstrip() === '  Strip it!' );
	this( s.rstrip(' !ti') === '  Strip' );

	this.exception(function() {
	    s.rstrip(10);
	});
    }),
    namespace(function rsplit() {
	var s	= Py("split on the spaces");

	this( typeof s.rsplit() === 'object' );
	this( s.rsplit()[0] === 'split' );
	this( s.rsplit()[3] === 'spaces' );
	this( s.rsplit('s')[1] === 'plit on the ' );
	this( s.rsplit('s', 2)[0] === 'split on the ' );

	this.exception(function() {
	    s.rsplit(10);
	});
	this.exception(function() {
	    s.rsplit('', '');
	});
    }),
    namespace(function split() {
	var s	= Py("split on the spaces");

	this( typeof s.split() === 'object' );
	this( s.split()[0] === 'split' );
	this( s.split()[3] === 'spaces' );
	this( s.split(" ", 2)[2] === 'the spaces' );
	this( s.split('s')[1] === 'plit on the ' );
	this( s.split('s', 2)[1] === 'plit on the ' );
	this( s.split('s', 2)[2] === 'paces' );

	this.exception(function() {
	    s.split(10);
	});
	this.exception(function() {
	    s.split('', '');
	});
    }),
    namespace(function splitlines() {
	var s	= Py("10\n0\n1\n15");
	
	this( typeof s.splitlines() === 'object' );
	this( s.splitlines().length	=== 4 )
	this( s.splitlines(true).length	=== 4 )
	this( s.splitlines()[0]		=== "10" )
	this( s.splitlines(true)[0]	=== "10\n" )
	
	this.exception(function() {
	    s.splitlines(10);
	});
    }),
    namespace(function strip() {
	var s	= Py("  Strip it!  ");

	this( typeof s.strip() === 'string' );
	this( s.strip() === 'Strip it!' );
	this( s.strip(' !ti') === 'Strip' );

	this.exception(function() {
	    s.strip(10);
	});
    }),
    namespace(function swapcase() {
	var s	= Py("SwApCaSe");
	this( s.swapcase() === "sWaPcAsE" )
    }),
    namespace(function title() {
	this( Py("they're bill's friends.").title() === "They'Re Bill'S Friends." )
	this( Py("Turn me into a title").title() === "Turn Me Into A Title" )
	this( Py("turn1me1into1a1title").title() === "Turn1Me1Into1A1Title" )
    }),
    namespace(function upper() {
	var s	= Py("hey");
	this( s.upper() == "HEY" );
    }),
    namespace(function zfill() {
	this( Py("89").zfill(5) === "00089" );
	this( Py("-89").zfill(5) === "-0089" );
	this( Py("bill").zfill(8) === "0000bill" );
	this( Py("-bill").zfill(8) === "-000bill" );
	
	this.exception(function() {
	    Py("-bill").zfill("8");
	});
    }),
    function finishedStringTests(n) {
	log.info("Passed", n, "string tests without binding");
	totalStringTests	+= n;
	return Promise.resolve(0);
    },
    namespace(function append() {
	var a		= Py(["Hello"]);
	a.append("World");
	this( a.length === 2 );
	this( a[1] === "World" );
    }),
    namespace(function extend() {
	var a		= Py(["Where"]);
	a.extend(["is", "my", "donut", "?"]);
	this( a.length === 5 );
	this( a[4] === "?" );
	this.exception(function() {
	    a.extend(null);
	});
    }),
    namespace(function insert() {
	var a		= Py(["World"]);
	a.insert(0, "Hello");
	this( a.length === 2 );
	this( a[0] === "Hello" );
	this.exception(function() {
	    a.insert("");
	});
    }),
    namespace(function remove() {
	var a		= Py(["Hello", "World"]);
	a.remove("Hello");
	this( a.length === 1 );
	this( a[0] === "World" );
    }),
    namespace(function pop() {
	var a		= Py(["What", "is", "my", "purpose", "?"]);
	
	this( a.pop(0) === "What" );
	this( a.length === 4 );
	this( a[2] === "purpose" );
	this.exception(function() {
	    a.pop("");
	});
    }),
    namespace(function index() {
	var a		= Py(["What", "is", "my", "purpose", "?"]);
	
	this( a.index("What") === 0 );
	this( a.index("?") === 4 );
    }),
    namespace(function count() {
	var a		= Py(["What", "is", "is", "purpose", "?"]);
	
	this( a.count("What") === 1 );
	this( a.count("is") === 2 );
    }),
    namespace(function copy() {
	var a		= Py(["Twins"]);
	var b		= a.copy();
	a.remove("Twins")
	this( a.length === 0 );
	this( b.length === 1 );
    }),
    function finishedArrayTests(n) {
	log.info("Passed", n, "array tests without binding");
	totalArrayTests		+= n;
	return Promise.resolve(0);
    },
    namespace(function clear() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	a.clear();
	this( Object.keys(a).length === 0 );
    }),
    namespace(function copy() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	var b		= a.copy();
	a.clear();
	this( Object.keys(a).length === 0 );
	this( Object.keys(b).length === 1 );
    }),
    namespace(function get() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	this( a.get('name') === "Mike Finkel" );
	this( a.get('age') === undefined );
	this( a.get('age', 22) === 22 );
	this.exception(function() {
	    a.get(1);
	});
    }),
    namespace(function keys() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	this( a.keys().length === 1 );
	this( a.keys()[0] === "name" );
    }),
    namespace(function pop() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	this( a.pop("name") === "Mike Finkel" );
	this( a.pop("name") === undefined );
	this( a.pop("name", "Brad") === "Brad" );
	this.exception(function() {
	    a.pop(1);
	});
    }),
    namespace(function popitem() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	this( a.popitem() === "Mike Finkel" );
	this( a.popitem() === undefined );
    }),
    namespace(function setdefault() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	
	this( a.setdefault("age", 22) === 22 );
	this( a.setdefault("age", 30) === 22 );
	this.exception(function() {
	    a.setdefault(1);
	});
	this.exception(function() {
	    a.setdefault("name", undefined);
	});
    }),
    namespace(function update() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	a.update({ "age": 22 });
	this( Object.keys(a).length === 2 );
	this( a["name"] === "Mike Finkel" );
	this( a["age"] === 22 );
	this.exception(function() {
	    a.update("name");
	});
    }),
    namespace(function values() {
	var a		= Py({
	    "name": "Mike Finkel"
	});
	this( a.values().length === 1 );
	this( a.values()[0] === "Mike Finkel" );
    }),
    function finishedObjectTests(n) {
	log.info("Passed", n, "object tests without binding");
	totalObjectTests	+= n;
	return Promise.resolve(0);
    },
    function bindingPythonify(n) {
    	log.warn("Binding pythonify to native objects");
    	Py.bind();
    	return Promise.resolve(0);
    },
    namespace(function capitalize() {
    	var s	= "hankRoids".$py();
	
    	this( typeof s.capitalize() === 'string' );
    	this( s.capitalize() === "Hankroids" );
    }),
    namespace(function repeat() {
    	var s	= "-".$py();
	
    	this( typeof s.repeat(10) === 'string' );
    	this( s.repeat(10).length === 10 );
    	this( s.repeat(10) === '----------' );
    	this( s.repeat(0) === '' );
    	this.exception(function() {
    	    s.repeat("10");
    	});
    }),
    namespace(function startswith() {
    	var s	= "This is the string!".$py();
	
    	this( typeof s.startswith('') === 'boolean' );
    	this( s.startswith('This') === true );
    	this( s.startswith('the') === false );
    	this.exception(function() {
    	    s.startswith(10);
    	});
    	this.exception(function() {
    	    s.startswith('', '', 1);
    	});
    	this.exception(function() {
    	    s.startswith('', 1, '');
    	});
    }),
    namespace(function endswith() {
    	var s	= "This is the string!".$py();
	
    	this( typeof s.endswith('') === 'boolean' );
    	this( s.endswith('string!') === true );
    	this( s.endswith('string') === false );
    	this( s.endswith('is', 0, 7) === true );
    	this( s.endswith('tring', 13, -1) === true );
    	this.exception(function() {
    	    s.endswith(10);
    	});
    	this.exception(function() {
    	    s.endswith('', '', 1);
    	});
    	this.exception(function() {
    	    s.endswith('', 1, '');
    	});
    }),
    namespace(function center() {
    	var s	= "Pint".$py();

    	this( typeof s.center(1) === 'string' );
    	this( s.center(1) === "Pint" );
    	this( s.center(20).length === 20 );
    	this( s.center(20, '-') === "--------Pint--------" );
    	this.exception(function() {
    	    s.center("Tarzan");
    	});
    }),
    namespace(function count() {
    	var s	= "This is the string!".$py();
	
    	this( typeof s.count('i') === 'number' );
    	this( s.count('i') === 3 );
    	this( s.count('i', 4) === 2 );
    	this( s.count('i', 4, -6) === 1 );
    	this.exception(function() {
    	    s.count(0);
    	});
    	this.exception(function() {
    	    s.count('', '', 1);
    	});
    	this.exception(function() {
    	    s.count('', 1, '');
    	});
    }),
    namespace(function replaceAt() {
    	var s	= "Hello World".$py();
	
    	this( typeof s.replaceAt(1, 'i') === 'string' );
    	this( s.replaceAt(6, "@") === "Hello@World" );
    	this( s.replaceAt(6, "  ") === "Hello  World" );
    	this( s.replaceAt(6, "  ", 2) === "Hello  orld" );
    	this( s.replaceAt(11, ".") === "Hello Worl." );
    	this.exception(function() {
    	    s.replaceAt('');
    	});
    	this.exception(function() {
    	    s.replaceAt(1, 1);
    	});
    	this.exception(function() {
    	    s.replaceAt(1, '', '');
    	});
    }),
    namespace(function find() {
    	var s	= "Hello World".$py();
	
    	this( typeof s.find('i') === 'number' );
    	this( s.find('lo') === 3 );
    	this( s.find('los') === -1 );
    	this( s.find('l') === 2 );
    	this( s.find('l', 2) === 0 );
    	this( s.find('rl', 0, -2) === -1 );
    	this.exception(function() {
    	    s.find(1);
    	});
    	this.exception(function() {
    	    s.find('', '');
    	});
    	this.exception(function() {
    	    s.find('', 1, '');
    	});
    }),
    namespace(function format() {
    	var data	= {
    	    length: 4,
    	    text: 'Flappy Bird',
    	    name: 'Travis'
    	};
    	this( "{0} {1}".$py().format("Hello", "World") === "Hello World" );
    	this( "{length} {0} {text} {1}".$py().format("Hello", "World", data) === "4 Hello Flappy Bird World" );
    	this( "{text} {length}".$py().format(data) === "Flappy Bird 4" );
    	this( "{name} {name}".$py().format(data) === "Travis Travis" );
    }),
    namespace(function expandtabs() {
    	var s	= "Hello\tWorld".$py();
	
    	this( typeof s.expandtabs() === 'string' );
    	this( s.expandtabs() == "Hello   World" );
    	this( s.expandtabs(7) == "Hello  World" );
    	this( "  Hello\tWorld".$py().expandtabs() == "  Hello World" );
	
    	var s	= "  \tHello\tWorld\t".$py();
    	this( s.expandtabs() == "        Hello   World   " );
    	this( s.expandtabs(4) == "    Hello   World   " );
	
    	this( "\tHello\n\tWorld".$py().expandtabs(4) == "    Hello\n    World" );
    	this( "\tHello\t\n\tWorld".$py().expandtabs(4) == "    Hello   \n    World" );
	
    	this.exception(function() {
    	    s.expandtabs('');
    	});
    }),
    namespace(function index() {
    	var s	= "Hello World".$py();
	
    	this( typeof s.index('llo') === 'number' );
    	this( s.index("llo") == 2 );
    	this( s.index("Wo", 6) == 0 );
    	this( s.index("W", 6, 7) == 0 );
    	this.exception(function() {
    	    s.index('f');
    	});
    	this.exception(function() {
    	    s.index('', '');
    	});
    	this.exception(function() {
    	    s.index('', 1, '');
    	});
    }),
    namespace(function join() {
    	var s	= "_".$py();

    	this( typeof s.join("n") === 'string' );
    	this( s.join("Mom") === "M_o_m");
    	this( s.join([1,2,3,4]) === "1_2_3_4");
    	this.exception(function() {
    	    s.join(4);
    	});
    }),
    namespace(function ljust() {
    	var s	= "king".$py();

    	this( typeof s.ljust(10) === 'string' );
    	this( s.ljust(10) === 'king      ' );
    	this( s.ljust(0) === 'king' );
	
    	this.exception(function() {
    	    s.ljust('');
    	});
    	this.exception(function() {
    	    s.ljust(10, 1);
    	});
    }),
    namespace(function lower() {
    	var s	= "GANGNAM STYLE".$py();

    	this( typeof s.lower() === 'string' );
    	this( s.lower() === 'gangnam style' );
    }),
    namespace(function lstrip() {
    	var s	= "  Strip it!  ".$py();

    	this( typeof s.lstrip() === 'string' );
    	this( s.lstrip() === 'Strip it!  ' );
    	this( s.lstrip(' tS') === 'rip it!  ' );

    	this.exception(function() {
    	    s.lstrip(10);
    	});
    }),
    namespace(function partition() {
    	var s	= "filename.txt".$py();

    	this( typeof s.partition('.') === 'object' );
    	this( s.partition('.')[0] === 'filename' );
    	this( s.partition('.')[1] === '.' );
    	this( s.partition('.')[2] === 'txt' );

    	this.exception(function() {
    	    s.partition();
    	});
    	this.exception(function() {
    	    s.partition(2);
    	});
    }),
    namespace(function istitle() {
    	var s		= "They'Re Bill'S Friends.".$py();
	
    	this( s.istitle() );
    }),
    namespace(function rfind() {
    	var s	= "Hello World".$py();
	
    	this( typeof s.rfind('i') === 'number' );
    	this( s.rfind('lo') === 3 );
    	this( s.rfind('los') === -1 );
    	this( s.rfind('l') === 9 );
    	this( s.rfind('l', 0, -2) === 3 );
    	this( s.rfind('rl', 0, -2) === -1 );
    	this.exception(function() {
    	    s.rfind(1);
    	});
    	this.exception(function() {
    	    s.rfind('', '');
    	});
    	this.exception(function() {
    	    s.rfind('', 1, '');
    	});
    }),
    namespace(function rindex() {
    	var s	= "Hello World".$py();
	
    	this( typeof s.rindex('llo') === 'number' );
    	this( s.rindex("llo") == 2 );
    	this( s.rindex("Wo", 6) == 0 );
    	this( s.rindex("W", 6, 7) == 0 );
    	this.exception(function() {
    	    s.rindex('f');
    	});
    	this.exception(function() {
    	    s.rindex('', '');
    	});
    	this.exception(function() {
    	    s.rindex('', 1, '');
    	});
    }),
    namespace(function rpartition() {
    	var s	= "file.name.txt".$py();

    	this( typeof s.rpartition('.') === 'object' );
    	this( s.rpartition('.')[0] === 'file.name' );
    	this( s.rpartition('.')[1] === '.' );
    	this( s.rpartition('.')[2] === 'txt' );

    	this.exception(function() {
    	    s.rpartition();
    	});
    	this.exception(function() {
    	    s.rpartition(2);
    	});
    }),
    namespace(function rjust() {
    	var s	= "king".$py();

    	this( typeof s.rjust(10) === 'string' );
    	this( s.rjust(10) === '      king' );
    	this( s.rjust(0) === 'king' );
	
    	this.exception(function() {
    	    s.rjust('');
    	});
    	this.exception(function() {
    	    s.rjust(10, 1);
    	});
    }),
    namespace(function rstrip() {
    	var s	= "  Strip it!  ".$py();

    	this( typeof s.rstrip() === 'string' );
    	this( s.rstrip() === '  Strip it!' );
    	this( s.rstrip(' !ti') === '  Strip' );

    	this.exception(function() {
    	    s.rstrip(10);
    	});
    }),
    namespace(function rsplit() {
    	var s	= "split on the spaces".$py();

    	this( typeof s.rsplit() === 'object' );
    	this( s.rsplit()[0] === 'split' );
    	this( s.rsplit()[3] === 'spaces' );
    	this( s.rsplit('s')[1] === 'plit on the ' );
    	this( s.rsplit('s', 2)[0] === 'split on the ' );

    	this.exception(function() {
    	    s.rsplit(10);
    	});
    	this.exception(function() {
    	    s.rsplit('', '');
    	});
    }),
    namespace(function split() {
    	var s	= "split on the spaces".$py();

    	this( typeof s.split() === 'object' );
    	this( s.split()[0] === 'split' );
    	this( s.split()[3] === 'spaces' );
    	this( s.split(" ", 2)[2] === 'the spaces' );
    	this( s.split('s')[1] === 'plit on the ' );
    	this( s.split('s', 2)[1] === 'plit on the ' );
    	this( s.split('s', 2)[2] === 'paces' );

    	this.exception(function() {
    	    s.split(10);
    	});
    	this.exception(function() {
    	    s.split('', '');
    	});
    }),
    namespace(function splitlines() {
    	var s	= "10\n0\n1\n15".$py();
	
    	this( typeof s.splitlines() === 'object' );
    	this( s.splitlines().length	=== 4 )
    	this( s.splitlines(true).length	=== 4 )
    	this( s.splitlines()[0]		=== "10" )
    	this( s.splitlines(true)[0]	=== "10\n" )
	
    	this.exception(function() {
    	    s.splitlines(10);
    	});
    }),
    namespace(function strip() {
    	var s	= "  Strip it!  ".$py();

    	this( typeof s.strip() === 'string' );
    	this( s.strip() === 'Strip it!' );
    	this( s.strip(' !ti') === 'Strip' );

    	this.exception(function() {
    	    s.strip(10);
    	});
    }),
    namespace(function swapcase() {
    	var s	= "SwApCaSe".$py();
    	this( s.swapcase() === "sWaPcAsE" )
    }),
    namespace(function title() {
    	this( "they're bill's friends.".$py().title() === "They'Re Bill'S Friends." )
    	this( "Turn me into a title".$py().title() === "Turn Me Into A Title" )
    	this( "turn1me1into1a1title".$py().title() === "Turn1Me1Into1A1Title" )
    }),
    namespace(function upper() {
    	var s	= "hey".$py();
    	this( s.upper() == "HEY" );
    }),
    namespace(function zfill() {
    	this( "89".$py().zfill(5) === "00089" );
    	this( "-89".$py().zfill(5) === "-0089" );
    	this( "bill".$py().zfill(8) === "0000bill" );
    	this( "-bill".$py().zfill(8) === "-000bill" );
	
    	this.exception(function() {
    	    "-bill".$py().zfill("8");
    	});
    }),
    function finishedBindStringTests(n) {
    	log.info("Passed", n, "string tests with binding");
    	totalStringTests	+= n;
    	totalTests		+= totalStringTests;
    	return Promise.resolve(0);
    },
    namespace(function append() {
	var a		= ["Hello"].$py();
	a.append("World");
	this( a.length === 2 );
	this( a[1] === "World" );
    }),
    namespace(function extend() {
	var a		= ["Where"].$py();
	a.extend(["is", "my", "donut", "?"]);
	this( a.length === 5 );
	this( a[4] === "?" );
	this.exception(function() {
	    a.extend(null);
	});
    }),
    namespace(function insert() {
	var a		= ["World"].$py();
	a.insert(0, "Hello");
	this( a.length === 2 );
	this( a[0] === "Hello" );
	this.exception(function() {
	    a.insert("");
	});
    }),
    namespace(function remove() {
	var a		= ["Hello", "World"].$py();
	a.remove("Hello");
	this( a.length === 1 );
	this( a[0] === "World" );
    }),
    namespace(function pop() {
	var a		= ["What", "is", "my", "purpose", "?"].$py();
	
	this( a.pop(0) === "What" );
	this( a.length === 4 );
	this( a[2] === "purpose" );
	this.exception(function() {
	    a.pop("");
	});
    }),
    namespace(function index() {
	var a		= ["What", "is", "my", "purpose", "?"].$py();
	
	this( a.index("What") === 0 );
	this( a.index("?") === 4 );
    }),
    namespace(function count() {
	var a		= ["What", "is", "is", "purpose", "?"].$py();
	
	this( a.count("What") === 1 );
	this( a.count("is") === 2 );
    }),
    namespace(function copy() {
	var a		= ["Twins"].$py();
	var b		= a.copy();
	a.remove("Twins")
	this( a.length === 0 );
	this( b.length === 1 );
    }),
    function finishedBindArrayTests(n) {
	log.info("Passed", n, "array tests with binding");
	totalArrayTests		+= n;
	return Promise.resolve(0);
    },
    namespace(function clear() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	a.clear();
	this( Object.keys(a).length === 0 );
    }),
    namespace(function copy() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	var b		= a.copy();
	a.clear();
	this( Object.keys(a).length === 0 );
	this( Object.keys(b).length === 1 );
    }),
    namespace(function get() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	this( a.get('name') === "Mike Finkel" );
	this( a.get('age') === undefined );
	this( a.get('age', 22) === 22 );
	this.exception(function() {
	    a.get(1);
	});
    }),
    namespace(function keys() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	this( a.keys().length === 1 );
	this( a.keys()[0] === "name" );
    }),
    namespace(function pop() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	this( a.pop("name") === "Mike Finkel" );
	this( a.pop("name") === undefined );
	this( a.pop("name", "Brad") === "Brad" );
	this.exception(function() {
	    a.pop(1);
	});
    }),
    namespace(function popitem() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	this( a.popitem() === "Mike Finkel" );
	this( a.popitem() === undefined );
    }),
    namespace(function setdefault() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	
	this( a.setdefault("age", 22) === 22 );
	this( a.setdefault("age", 30) === 22 );
	this.exception(function() {
	    a.setdefault(1);
	});
	this.exception(function() {
	    a.setdefault("name", undefined);
	});
    }),
    namespace(function update() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	a.update({ "age": 22 });
	this( Object.keys(a).length === 2 );
	this( a["name"] === "Mike Finkel" );
	this( a["age"] === 22 );
	this.exception(function() {
	    a.update("name");
	});
    }),
    namespace(function values() {
	var a		= {
	    "name": "Mike Finkel"
	}.$py();
	this( a.values().length === 1 );
	this( a.values()[0] === "Mike Finkel" );
    }),
    function finishedBindObjectTests(n) {
	log.info("Passed", n, "object tests with binding");
	totalObjectTests	+= n;
	return Promise.resolve(0);
    },
    function finishedBindArrayTests(n) {
    	log.info("Passed", n, "array tests with binding");
    	totalArrayTests		+= n;
    	totalTests		+= totalArrayTests;
    	return Promise.resolve(0);
    }
]).then(function(n) {
    log.info("Passed", totalGeneralTests, "general tests");
    log.info("Passed", totalStringTests, "string tests");
    log.info("Passed", totalNumberTests, "number tests");
    log.info("Passed", totalArrayTests, "array tests");
    log.info("Passed", totalObjectTests, "object tests");
    log.warn("Total Tests Passed", totalTests);
}, function(err) {
    log.error(err);
});
