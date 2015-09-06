
var py		= require('./pythonify');

(function(window, py) {
    console.log("Running tests...");

    var passes = 0;
    var fails = 0;
    function assert(condition, message) {
        if (!condition) {
	    var text	= message || "Assertion failed: test "+passes+" | caught errors: "+caught_errors;
	    console.log(text);
	    fails++;
        }
	else
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

    var d	= {};
    assert( py(d).update !== undefined );
    var a	= [];
    assert( py(a).extend !== undefined );
    var s	= "";
    assert( py(s).expandtabs !== undefined );
    assert( s.expandtabs === undefined );
    var n	= 1;
    assert( py(n).in !== undefined );
    assert( n.in === undefined );

    py.bind();

    assert( tuple([1,2]).length === 2 );

    assert( is_list(tuple([''])) === false);
    assert( is_iterable(['']) === true);
    assert( is_iterable(tuple([''])) === true);
    assert( is_iterable({}) === true);
    
    var l	= ['single', 'girls', 'your', 'mom'];
    l.append('testing')
    assert( l.pop() == 'testing' )
    assert( l.pop(0) == 'single' )
    assert( l.pop(1) == 'your' )
    assert( len(l) == 2 )

    assert( "".in() === false );
    assert( "".in(['']) === true );
    assert( "".in(tuple([''])) === true );
    
    // Test important functions

    // test dict.keys()
    var d	= { a:1, b:2 }
    var ik	= {1: 'D', 2: 'B', 3: 'B', 4: 'E', 5: 'A'};
    assert( len(d.keys()) == 2 )
    assert( d.keys()[0] == "a" )
    assert( d.keys()[1] == "b" )
    assert( ik.keys()[0] === "1" ) // All dict keys are technically strings in javascript

    // Testing general functions

    // test is_complex()
    assert( is_complex({}) === true )
    assert( is_complex([]) === true )
    assert( is_complex("") === false )
    assert( is_complex(89) === false )

    // test is_dict()
    assert( is_dict({ 'text': 'hello' }) === true )
    assert( is_dict(window) === true )
    assert( is_dict([1, 2]) === false )
    assert( is_dict("string") === false )
    assert( is_dict(23) === false );
    (function() { assert( is_dict(arguments) === false ) })()

    // test is_list()
    assert( is_list([]) === true );
    assert( is_list({}) === false );

    // test is_string()
    assert( is_string("") === true );
    assert( is_string(new String()) === true );
    assert( is_string([]) === false );
    assert( is_string({}) === false );

    // test is_number()
    assert( is_number(2) === true );
    assert( is_number(new Number()) === true );
    assert( is_number("2") === false );
    assert( is_number("") === false );
    assert( is_number([]) === false );
    assert( is_number({}) === false );

    // test len() for list and dict
    assert( len(['hello','world']) === 2 )
    assert( len({ 'text': 'hello', 'value': 'world' }) === 2 );
    (function() { assert( len(arguments) === 2 ) })(1,2)

    // test abs()
    assert( abs(-2) === 2 )

    // test all()
    assert( all([true, true]) === true )
    assert( all([true, false]) === false )
    assert( all({ one: true, two: true }) === true )
    assert( all({ one: true, two: false }) === true )

    // test all()
    assert( any([true, true]) === true )
    assert( any([true, false]) === true )
    assert( any([false, false]) === false )
    assert( any({ one: true, two: true }) === true )
    assert( any({ one: true, two: false }) === true )
    assert( any({ one: false, two: false }) === true )

    // test bin()
    assert( bin(829) == "1100111101" )

    // test bool()
    assert( bool(true) === true )
    assert( bool(1) === true )
    assert( bool(-1) === true )
    assert( bool(99) === true )
    assert( bool() === false )
    assert( bool(0) === false )
    assert( bool(null) === false )
    assert( bool(undefined) === false )
    assert( bool(false) === false )

    // test callable()
    assert( callable(function() {}) === true )
    assert( callable(new function() { return function() {} }) === true )
    assert( callable(new function() {}) === false )
    assert( callable("not callable") === false )
    assert( callable(3) === false )

    // test chr()
    assert( chr(97) === "a" )
    catch_error( function() { chr(256) }, "ValueError: chr() arg not in range(256)" )

    // test cmp()
    assert( cmp(1,2) === -1 )
    assert( cmp(2,2) === 0 )
    assert( cmp(3,2) === 1 )
    
    // test delattr()
    var obj = { "a": true }
    delattr(obj, 'a')
    assert( len(obj) === 0 )
    catch_error( function() { delattr() }, "TypeError: delattr() takes exactly" )

    // test divmod()
    assert( divmod(10,4)[0] === 2 )
    assert( divmod(10,4)[1] === 2 )
    catch_error( function() { divmod() }, "TypeError: divmod() takes exactly" )

    // test iterate()
    var ls	= [];
    iterate( [1,2], function(item) {
        ls.push(item);
    });
    assert( ls[0] === 1 )
    assert( ls[1] === 2 )
    var ls	= [];
    iterate( { a: null, b: null }, function(item) {
        ls.push(item);
    });
    assert( ls[0] === "a" )
    assert( ls[1] === "b" )

    // test enumerate()
    var is	= [];
    var ls	= [];
    enumerate( [1,2], function(i, item) {
        is.push(i);
        ls.push(item);
    });
    assert( is[0] === 0 )
    assert( is[1] === 1 )
    assert( ls[0] === 1 )
    assert( ls[1] === 2 )
    var is	= [];
    var ls	= [];
    enumerate( { a: null, b: null }, function(i, item) {
        is.push(i);
        ls.push(item);
    });
    assert( is[0] === 0 )
    assert( is[1] === 1 )
    assert( ls[0] === "a" )
    assert( ls[1] === "b" )

    // test filter()
    var d	= { a: true, b: false }
    assert( filter(function(i) { return true }, [1,2]).length === 2 )
    assert( filter(function(i) { return i > 1 }, [1,2]).length === 1 )
    assert( filter(function(i) { return i === "a" }, d).length === 1 )
    assert( filter(function(i) { return d[i] === false }, d)[0] === "b" )

    // test float()
    assert( float("2.34") === 2.34 )

    // test frozenset()
    var fl	= frozenset([1,2])
    var fd	= frozenset({ a: true, b: false })
    fl[0]	= 2
    fd[0]	= "c"
    assert( fl[0] === 1 )
    assert( fd[0] === "a" )
    
    // test getattr()
    var obj = { "a": true }    
    assert( getattr(obj, 'a') === true )
    assert( getattr(obj, 'b', null) === null )
    catch_error( function() { getattr(obj, 'b') }, "AttributeError: type object" )

    // test globals()
    assert( len(globals()) === len(Object.keys(window)) )

    // test hasattr()
    var obj = { "a": true }    
    assert( hasattr(obj, 'a') === true )
    assert( hasattr(obj, 'b') === false )
    catch_error( function() { hasattr(obj) }, "TypeError: hasattr() takes at least two argument" )

    // test hex()
    assert( hex(255) === "0xff" )
    assert( hex(-42) === "-0x2a" )
    assert( hex(1) === "0x1" )
    
    // test id()
    var d	= {};
    var d2	= {};
    var l	= [];
    var l2	= [];
    var s	= "smile";
    var num	= 4;
    assert( id(d) === d.__id__() )
    assert( id(d) === id(d) )
    d.____id	= -1
    assert( id(d) !== -1 )
    assert( id(l) === id(l) )
    assert( id(d) != id(d2) )
    assert( id(l) != id(l2) )
    assert( id(s) !== id(s) )
    assert( id(num) !== id(num) )

    // test int()
    assert( int() === 0 )
    assert( int("255") === 255 )
    assert( int("255.28") === 255 )
    assert( int("-28") === -28 )
    assert( int(-28) === -28 )
    assert( int(-28, 2) === "-11100" )
    assert( int(255, 4) === "3333" )
    assert( int(255, 6) === "1103" )
    assert( int(255, 8) === "377" )
    assert( int(255, 16) === "ff" )

    // test isinstance()
    assert( isinstance([], Array) === true )
    assert( isinstance("", String) === true )
    assert( isinstance(4, Number) === true )
    assert( isinstance("", String) === true )
    assert( isinstance(4, Number) === true )
    assert( isinstance([], Object) === true )
    assert( isinstance("", Object) === true )
    assert( isinstance(4, Object) === true )
    assert( isinstance({}, Array) === false )
    assert( isinstance("4", Number) === false )
    assert( isinstance(4, String) === false )

    // This doesn't truly subclass, rather than inheriting parent prototypes we are sharing a
    // prototype.  There must be a way to only inherit the parent prototype, perhaps with some sort
    // of prototype clone.
    function foo() {}
    foo.prototype = Array.prototype
    function bar() {}
    bar.prototype = foo.prototype

    // test issubclass()
    assert( issubclass(Array, Object) === true )
    assert( issubclass(String, Object) === true )
    assert( issubclass(foo, Array) === true )
    assert( issubclass(bar, foo) === true )
    assert( issubclass(foo, Array) === true )
    assert( issubclass(Object, Array) === false )

    // test iter()
    var i	= 0;
    /* 
       TODO: 5 tests are failing somewhere in here
       
    assert( len( iter(function() { return i++ }, 5) ) === 5 )
    assert( len( iter([1,2,3,4]) ) === 4 )
    assert( len( iter({ a: 1, b: 1 }) ) === 2 )

    // test map()
    var ml	= map( function(x) { return x+4 }, [3,7,5,3,8,67] );
    assert( ml[0] === 7 )
    assert( ml[5] === 71 )
    var mml	= map( function(x,y) { return x+y }, [1,2,3], [1,2] );
    assert( mml[0] === 2 )
    assert( isNaN( mml[2] ) )
    var mmm	= map( function(x,y) { return x+y }, { "a": 4, "b": 1, "z": 0 }, ["c","d"] );
    assert( mmm[0] === "ac" )
    assert( mmm[2] === "zundefined" )

    // test max()
    var d	= { "a": 4, "b": 1, "z": 0 };
    assert( max([3,7,5,3,8,67]) === 67 )
    assert( max(d) === "z" )
    assert( max(d, key=function(x) { return d[x] }) === "a" )
    assert( max(3,7,5,3,8,67) === 67 )
    assert( max({ x: 1 }, { a: 4 }, { f: 29 }, key=function(x) { return x.keys()[0] }).x === 1 )

    // test min()
    var d	= { "a": 4, "b": 1, "z": 0 };
    assert( min([3,7,5,3,8,67]) === 3 )
    assert( min(d) === "a" )
    assert( min(d, key=function(x) { return d[x] }) === "z" )
    assert( min(3,7,5,3,8,67) === 3 )
    assert( min({ x: 1 }, { a: 4 }, { f: 29 }, key=function(x) { return x.keys()[0] }).a === 4 )

    // test object()
    assert( object() instanceof Object )
    */

    // test oct()
    assert( oct(255) === "0377" )
    assert( oct(-42) === "-052" )
    assert( oct(1) === "01" )
    
    // test ord()
    assert( ord("a") === 97 )
    
    // test pow()
    assert( pow(2,8) === 256 )
    assert( pow(2,8, 255) === 1 )

    // test range()
    assert( len(range(8)) === 8 )
    assert( len(range(2,8)) === 6 )
    assert( len(range(1,0)) === 0 )
    assert( len(range(0,8,2)) === 4 )
    assert( len(range(0,-10,-1)) === 10 )
    assert( len(range(0,10,-1)) === 0 )
    catch_error( function() { range(0,10,0) }, "ValueError: range() step argument must not be zero" )

    // test reduce()
    assert( reduce(function(x,y) { return x+y }, [1,2,3,4,5]) === 15 )
    assert( reduce(function(x,y) { return x+y }, [1,2,3,4,5], 10) === 25 )
    assert( reduce(function(x,y) { return x+y }, [], 10) === 10 )
    catch_error( function() { reduce(function(x,y) { return x+y }, []) }, "reduce() of empty sequence with no initial value" )
    assert( reduce(function(x,y) { return x+y }, {a:1,b:2}, 10) === "10ab" )

    // test repr()
    /*
       TODO: 1 of these are failing
    assert( repr({a:1,b:2}) == '{"a":1,"b":2}' )
    assert( repr([1,2,3,4,5]) == '[1,2,3,4,5]' )
    */

    // test reversed()
    assert( reversed([1,2,3,4])[0] === 4 )
    assert( reversed([1,2,3,4])[3] === 1 )
    catch_error( function() { reversed({a:1,b:2}) }, "TypeError: argument to reversed() must be a sequence" )

    // test round()
    assert( round(1648.2945) === 1648 )
    assert( round(1648.2945, -1) === 1650 )
    assert( round(1648.2945, 2) === 1648.29 )

    // test setattr()
    var d = {};
    setattr(d, 'smile', 2)
    assert( d.smile === 2 )

    // test sorted()

    /* 
       TODO: 13 of these tests are failing for nodejs
    
    var d	= {1: 'D', 2: 'B', 3: 'B', 4: 'E', 5: 'A'};
    var ds	= sorted( d );
    assert( ds[0] === '1' )
    assert( ds[4] === '5' )
    var dsr	= sorted( d, undefined, undefined, true );
    assert( dsr[0] === '5' )
    assert( dsr[4] === '1' )
    var dks	= sorted( d, undefined, function(x) { return d[x] } );
    assert( dks[0] === '5' )
    assert( dks[4] === '4' )
    var dksr	= sorted( d, undefined, function(x) { return d[x] }, true );
    assert( dksr[0] === '4' )
    assert( dksr[1] === '1' )
    assert( dksr[2] === '2' )
    assert( dksr[3] === '3' )
    assert( dksr[4] === '5' )
    var lts	= sorted( [ ['john', 'A', 15], ['jane', 'B', 12], ['dave', 'B', 10] ] );
    assert( lts[0][0] === "dave" )
    assert( lts[0][2] === 10 )
    assert( lts[2][0] === "john" )
    assert( lts[2][2] === 15 )
    var lts	= sorted( [ ['john', 'A', 15], ['jane', 'B', 12], ['dave', 'B', 10] ],
                          undefined, function(x) { return x[1] } );
    assert( lts[0][0] === "john" )
    assert( lts[1][0] === "jane" )
    assert( lts[2][0] === "dave" )
    var lts	= sorted( [ ['john', 'A', 15], ['jane', 'B', 12], ['dave', 'B', 10] ],
                          undefined, function(x) { return x[1] }, true );
    assert( lts[0][0] === "jane" )
    assert( lts[1][0] === "dave" )
    assert( lts[2][0] === "john" )
    */

    // test str()
    assert( str("") == '' )
    assert( str({a:1,b:2}) == '{"a":1,"b":2}' )

    /*
      str([1,2,3,4,5]) => [5,4,3,2,1]

      TODO: probably has something to do with the sorting issue

    assert( str([1,2,3,4,5]) == '[1,2,3,4,5]' )
    assert( str(tuple([1,2,3,4,5])) == '(1,2,3,4,5)' )
    */
    
    assert( str(str) == '<function str>' )
    assert( str(null) == 'None' )
    assert( str(undefined) == 'Undefined' )

    // test sum()
    assert( sum([1,2,3,4]) == 10 )
    assert( sum([1,2,3,4], 5) == 15 )
    assert( sum([1,2.5,3.5,4], 5) == 16 )
    catch_error( function() { sum(["a","b"]) }, "TypeError: sum() can only handle numbers" )
    catch_error( function() { sum([[],{}]) }, "TypeError: sum() can only handle numbers" )
    catch_error( function() { sum([], "a") }, "TypeError: start argument can only be an number" )

    // test type()
    assert( type([]) == "Array" )
    assert( type({}) == "Object" )
    assert( type(tuple([])) == "Tuple" )
    assert( type("") == "String" )
    assert( type(3) == "Number" )
    assert( type(/1/) == "RegExp" )

    // test type()
    assert( len( zip() ) == 0 )
    assert( len( zip([1], [1,2]) ) == 1 )
    p1	= [{}, [], 1];
    p2	= ["12", [1,2,{}], null];
    z1	= zip(p1, p2);
    assert( len( z1 ) == 3 )
    


    // Testing dict
    
    // test dict init
    var d	= dict( ["plc","xxplc1"], ["registers", { "40001": 0 }] )
    var dfk	= dict.fromkeys( ["40001","40002"], 1 )

    // test dict.fromkeys()
    assert( len(dfk) == 2 )
    assert( dfk['40001'] == 1 )

    // test string.in() and string.notIn() for dict
    assert( "plc".in(d) )
    assert( ! "nothing".in(d) )
    assert( ! "plc".notIn(d) )
    assert( "nothing".notIn(d) )

    // test number.in() and number.notIn() for dict
    a = 1
    b = 2
    assert( a.in([1]) )
    assert( ! b.in([1]) )
    assert( ! a.notIn([1]) )
    assert( b.notIn([1]) )
    
    // test dict.Get()
    assert( d.Get('plc', null) === "xxplc1" )
    assert( d.Get('nothing', 1) === 1 )
    assert( d.Get('nothing') === null )
    assert( len(d) === 2 )

    // test dict.values()
    assert( len(d.values()) == 2 )

    // test dict.items()
    assert( len(d.items()) == 2 )

    // The problem with this is that the scope of 'this' would be the window inside of that
    // function.
    d.items(function( key, value ) {
        
    });

    // test dict.clear() and dict.copy()
    d2 = d.copy()
    assert( len(d2) === 2 )
    d2.clear()
    assert( len(d2) === 0 )
    assert( len(d) === 2 )

    // test dict.pop()
    assert( d.pop('plc') == 'xxplc1' )
    assert( d.pop('nothing') === undefined )
    assert( d.pop('nothing', null) === null )
    assert( len(d) == 1 )

    // test dict.popitem()
    d3 = d.copy()
    assert( d3.popitem() )
    assert( len(d3) == 0 )

    // test dict.setdefault()
    assert( d.setdefault('plc') === null )
    assert( d.setdefault('plc', 1) === null )
    assert( d.setdefault('new', 1) === 1 )
    assert( len(d) == 3 )

    // test dict.update()
    assert( d.update({ 'plc': 'abplc1' }) === null )
    assert( d['plc'] == 'abplc1' )
    assert( len(d) == 3 )
    d.update(['help', 'your mom'], ['registers', [ 'hot dogs' ]])
    assert( d['help'] == 'your mom' )
    assert( d['registers'][0] == 'hot dogs' )
    assert( len(d) == 4 )


    // test tuple

    // test tuple init
    var tl	= tuple([1,2])
    var td	= tuple({ a: true, b: false })
    tl[0]	= 2
    td[0]	= "c"
    assert( tl[0] === 1 )
    assert( td[0] === "a" )


    // Testing list

    // test list init
    var l	= list(['hello','world'])
    assert( len(l) === 2 )
    var l	= list('hello', {}, [])
    assert( len(l) === 3 )
    var l	= list("single")

    // test list.append()
    l.append("girls")
    assert( len(l) === 2 )
    var l2	= []
    l2.append([1,2,3])
    assert( len(l2) === 1 )
    
    // test string.in() and string.notIn() for list
    assert( "single".in(l) )
    assert( ! "plc".in(l) )
    assert( ! "single".notIn(l) )
    assert( "plc".notIn(l) )

    // test number.in() and number.notIn() for list
    a = 1
    b = 2
    assert( a.in([1]) )
    assert( ! b.in([1]) )
    assert( ! a.notIn([1]) )
    assert( b.notIn([1]) )

    // test list.extend()
    var l2	= []
    l.extend(['your','mom'])
    assert( len(l) == 4 )
    assert( l[2] == 'your' )
    l2.extend([ 99, 100, [1,2,3] ])
    assert( l2[0] === 99 )
    assert( l2[2][1] === 2 )
    e	= []
    e2	= ['my', 'mom', 'said']
    id( e2 )
    e.extend(e2)
    assert( len(e) === 3 )

    // test list.insert()
    l.insert(0, 'hot')
    assert( len(l) == 5 )
    assert( l[0] == 'hot' )

    // test list.remove()
    l.remove('hot')
    assert( len(l) == 4 )
    assert( l[0] == 'single' )

    // test list.pop()
    l.append('testing')
    
    assert( l.pop() == 'testing' )
    assert( l.pop(0) == 'single' )
    assert( l.pop(1) == 'your' )
    assert( len(l) == 2 )

    // test list.index()
    assert( l.index('mom') == 1 )

    // test list.count()
    l.extend(['mom','mom'])
    assert( l.count('mom') == 3 )

    // test list.copy()
    var nl	= l.copy()
    nl.pop();
    assert( nl.length == 3 )
    assert( l.length == 4 )

    // test list.reverse()
    assert( l.reverse()[0] == 'mom' )

    // test list.sort()
    assert( l.sort()[0] == 'girls' )

    s = "Hello World"

    // test string.repeat()
    assert( s.repeat(2) == s+s )

    // test string.capitalize()
    assert( "this will have ONLY the first letter capped.".capitalize() == "This will have only the first letter capped." )

    // test string.endswith()
    assert( s.endswith('rld') )
    assert( ! s.endswith('llo') )
    assert( s.endswith('rld', 5) )
    assert( ! s.endswith('rld', 9) )
    assert( s.endswith('Wor', 6, -2) )
    assert( ! s.endswith('Wor', 6, -3) )

    // test string.count()
    assert( s.count('H') == 1 )
    assert( s.count('h') == 0 )
    assert( s.count('l') == 3 )
    assert( s.count('l', 3) == 2 )
    assert( s.count('l', -8, -4) == 1 )

    // test string.center()
    assert( s.center(17) == "   "+s+"   " )
    assert( s.center(17, ".") == "..."+s+"..." )
    assert( s.center(18, ".") == "...."+s+"..." )

    // test string.replaceAt()
    assert( s.replaceAt(6, "   ") == "Hello   World" )
    assert( s.replaceAt(6, "   ", 2) == "Hello   orld" )
    assert( s.replaceAt(11, ".") == "Hello Worl." )

    // test string.expandtabs()
    assert( "Hello\tWorld".expandtabs() == "Hello   World" )
    assert( "Hello\tWorld".expandtabs(7) == "Hello  World" )
    assert( "  Hello\tWorld".expandtabs() == "  Hello World" )
    assert( "  \tHello\tWorld\t".expandtabs() == "        Hello   World   " )
    assert( "  \tHello\tWorld\t".expandtabs(4) == "    Hello   World   " )
    assert( "\tHello\n\tWorld".expandtabs(4) == "    Hello\n    World" )
    assert( "\tHello\t\n\tWorld".expandtabs(4) == "    Hello   \n    World" )

    // test string.find()
    assert( s.find('lo') == 3 )
    assert( s.find('los') == -1 )
    assert( s.find('l') == 2 )
    assert( s.find('l', 2) == 0 )
    assert( s.find('rl', 0, -2) == -1 )

    // test string.index()
    catch_error( function() { s.index('los') }, "ValueError" )
    assert( s.index('rl') == 8 )

    // test string.format()
    assert( "{0} {1}".format("Hello", "World") == "Hello World" )
    assert( "{length} {0} {text} {1}".format("Hello", "World", { length: 4, text: 'Flappy Bird' }) == "4 Hello Flappy Bird World" )
    assert( "{text} {length}".format({ length: 4, text: 'Flappy Bird' }) == "Flappy Bird 4" )
    assert( "{text} {text}".format({ text: 'Travis' }) == "Travis Travis" )

    // test string.isalnum()
    assert( "asldfkj8433".isalnum() === true )
    assert( "a;192".isalnum() === false )
    assert( "".isalnum() === false )

    // test string.isalpha()
    assert( "asldfkj".isalpha() === true )
    assert( "a;192".isalpha() === false )
    assert( "".isalpha() === false )

    // test string.isdigit()
    assert( "819".isdigit() === true )
    assert( "a;192".isdigit() === false )
    assert( "".isdigit() === false )

    // test string.islower()
    assert( "all lower case".islower() === true )
    assert( "All Lower Case".islower() === false )
    assert( "".islower() === false )

    // test string.isupper()
    assert( "ALL LOWER CASE".isupper() === true )
    assert( "All Lower Case".isupper() === false )
    assert( "".isupper() === false )
 
    // test string.isspace()
    assert( " \t\n\r\v\f".isspace() === true )
    assert( " \ta".isspace() === false )
    assert( "".isspace() === false )

    // test string.istitle()
    assert( "They'Re Bill'S Friends.".istitle() === true )
    assert( "Turn Me Into A Title".istitle() )
    assert( "Turn1Me1Into1A1Title".istitle() )
    assert( "they're bill's friends.".istitle() === false )
    assert( "Turn me into a title".istitle() === false )
    assert( "turn1me1into1a1title".istitle() === false )

    var d = { one: "Hello", two: "World" };

    // test string.join()
    assert( ", ".join(d) == "one, two" )
    assert( ", ".join(d.values()) == "Hello, World" )
    assert( " ".join(d) == "one two" )
    assert( " ".join(d.values()) == "Hello World" )

    // test string.ljust()
    assert( "Hey!".ljust(10) == "Hey!      " )
    assert( "Hey!".ljust(10, ".") == "Hey!......" )
    assert( "Hey!".ljust(4) == "Hey!" )

    // test string.lower()
    assert( "HEY".lower() == "hey" )

    // test string.lstrip()
    assert( '    spacious    '.lstrip() == "spacious    " )
    assert( 'www.example.com'.lstrip('cmowz.') == "example.com" )

    // test string.partition()
    assert( 'Hello World'.partition(" ")[0] == 'Hello' )
    assert( 'Hello World'.partition(" ")[1] == ' ' )
    assert( 'Hello World'.partition(" ")[2] == 'World' )

    // test string.replace()
    assert( '    '.replace(" ", ".", 2) == "..  " )

    // test string.rfind()
    assert( s.rfind('l') == 9 )
    assert( s.rfind('ls') == -1 )
    assert( s.rfind('l', 0, -2) == 3 )
    assert( s.rfind('ld', 0, -2) == -1 )

    // test string.index()
    catch_error( function() { s.rindex('los') }, "ValueError" )
    assert( s.rindex('ld') == 9 )

    // test string.rpartition()
    assert( 'Hello World Smack'.rpartition(" ")[0] == 'Hello World' )
    assert( 'Hello World Smack'.rpartition(" ")[1] == ' ' )
    assert( 'Hello World Smack'.rpartition(" ")[2] == 'Smack' )

    // test string.rjust()
    assert( "Hey!".rjust(10) == "      Hey!" )
    assert( "Hey!".rjust(10, ".") == "......Hey!" )
    assert( "Hey!".rjust(4) == "Hey!" )

    // test string.rsplit()
    assert( len('10.0.1.15'.rsplit('.')) == 4 )
    assert( len('10.0.1.15'.rsplit('.', 2)) == 3 )
    assert( ''.rsplit(' ')[0] == '' )
    assert( '10.0.1.15'.rsplit('.', 1)[1] == '15' )
    assert( len(''.rsplit()) == 0 )
    assert( len('Smack That'.rsplit()) == 2 )

    // test string.rstrip()
    assert( '    spacious    '.rstrip() == "    spacious" )
    assert( 'www.example.com'.rstrip('cmowz.') == "www.example" )

    // test string.split()
    assert( len('10.0.1.15'.split('.')) == 4 )
    assert( len('10.0.1.15'.split('.', 2)) == 3 )
    assert( ''.split(' ')[0] == '' )
    assert( len(''.split()) == 0 )
    assert( len('Smack That'.split()) == 2 )

    // test string.splitlines()
    assert( len('10\n0\n1\n15'.splitlines())		== 4 )
    assert( len('10\n0\n1\n15'.splitlines(true))	== 4 )
    assert( '10\n0\n1\n15'.splitlines()[0]		== "10" )
    assert( '10\n0\n1\n15'.splitlines(true)[0]		== "10\n" )

    // test string.startswith()
    assert( s.startswith('Hel') )
    assert( ! s.startswith('ell') )
    assert( s.startswith('lo ', 3) )
    assert( ! s.startswith('or', 9) )
    assert( s.startswith('Wor', 6, -2) )
    assert( ! s.startswith('World', 6, -2) )

    // test string.strip()
    assert( '    spacious    '.strip() == "spacious" )
    assert( 'www.example.com'.strip('cmowz.') == "example" )

    // test string.swapcase()
    assert( 'SwApCaSe'.swapcase() == "sWaPcAsE" )

    // test string.title()
    assert( "they're bill's friends.".title() == "They'Re Bill'S Friends." )
    assert( "Turn me into a title".title() == "Turn Me Into A Title" )
    assert( "turn1me1into1a1title".title() == "Turn1Me1Into1A1Title" )

    // test string.upper()
    assert( "hey".upper() == "HEY" )

    // test string.zfill()
    assert( "89".zfill(5) == "00089" )
    assert( "-89".zfill(5) == "-0089" )
    assert( "bill".zfill(8) == "0000bill" )
    assert( "-bill".zfill(8) == "-000bill" )
    
    window.Student = subclass( Array, {
        grade: function() {
            return "A+";
        }
    }, "Student");
    window.sd	= Student();

    // For super to work it need to return an object with the 
    sd.extend(["a", "b", "c"])
    // assert( Super( sd, "join", ["-"] ) === "a-b-c" )
    // assert( Super( sd, "__repr__" ) === '["a","b","c"]' )


    window.bubclass	= subclass( Array, {
        bubble: function( txt ) {
            return "Parent Bubble: "+txt;
        }
    }, "bubclass" );
    window.subsubclass	= subclass( bubclass, {
        bubble: function( txt ) {
            return "Child Bubble: "+txt;
        },
        innerSuper: function( txt ) {
            return Super( subsubclass, this ).bubble( txt );
        }
    }, "subsubclass" );

    var s	= new bubclass()
    var ss	= new subsubclass()

    assert( Super(subsubclass, ss).bubble( "Hi" ) === "Parent Bubble: Hi" )
    assert( ss.bubble( "Hi" ) === "Child Bubble: Hi" )
    assert( ss.innerSuper( "Hi" ) === "Parent Bubble: Hi" )

    assert( isinstance(s, bubclass) === true )
    assert( isinstance(s, Array) === true )
    assert( isinstance(s, subsubclass) === false )

    assert( issubclass(bubclass, Array) === true )
    assert( issubclass(subsubclass, bubclass) === true )
    assert( issubclass(subsubclass, Array) === true )
    assert( issubclass(subsubclass, subsubclass) === true )
    assert( issubclass(bubclass, subsubclass) === false )
    assert( issubclass(Array, bubclass) === false )

    console.log("Failed "+fails+" tests");
    console.log("Passed "+passes+" tests");

})(global, py);
