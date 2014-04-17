
(function(window) {

    console.log("Running tests...");

    passes = 0
    // Run tests
    function assert(condition, message) {
        if (!condition) {
            throw message || "Assertion failed";
        }
        passes++
    }

    // Check error for expected failure
    function catch_error(callback, expected) {
        var error	= "";
        try {
            callback();
        }
        catch(err) {
            error	= err;
        }
        assert( error.startswith(expected) === true );
    }

    // Testing general functions

    // test is_dict()
    assert( is_dict({ 'text': 'hello' }) === true )
    assert( is_dict(window) === true )
    assert( is_dict([1, 2]) === false )
    assert( is_dict("string") === false )
    assert( is_dict(23) === false )

    // test len() for list and dict
    assert( len(['hello','world']) === 2 )
    assert( len({ 'text': 'hello', 'value': 'world' }) === 2 )

    // test abs()
    assert( abs(-2) === 2 )

    // test all()
    assert( all([true, true]) === true )
    assert( all([true, false]) === false )
    assert( all({ one: true, two: true }) === true )
    assert( all({ one: true, two: false }) === false )

    // test all()
    assert( any([true, true]) === true )
    assert( any([true, false]) === true )
    assert( any([false, false]) === false )
    assert( any({ one: true, two: true }) === true )
    assert( any({ one: true, two: false }) === true )
    assert( any({ one: false, two: false }) === false )

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

    // test enumerate()
    var l	= enumerate( [1,2] );
    assert( l[0].length === 2 )
    assert( l[0][0] === 0 )
    assert( l[0][1] === 1 )
    var d	= enumerate( { a: null, b: null } );
    assert( d[0].length === 2 )
    assert( d[0][0] === 0 )
    assert( d[0][1] === "a" )

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
    var d = {};
    var d2 = {};
    assert( id(d) === d.id() )
    assert( id(d) != id(d2) )

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
    assert( isinstance([], Object) === false )
    assert( isinstance({}, Array) === false )
    assert( isinstance("4", Number) === false )
    assert( isinstance(4, String) === false )
    assert( isinstance(4, Object) === false )

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
    assert( len( iter(function() { return i++ }, 5) ) === 5 )
    assert( len( iter([1,2,3,4]) ) === 4 )
    assert( len( iter({ a: 1, b: 1 }) ) === 2 )

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
    catch_error( function() { len(range(0,10,0)) === 0 }, "ValueError: range() step argument must not be zero" )



    // Testing dict
    
    // test dict init
    var d	= dict( ["plc","xxplc1"], ["registers", { "40001": 0 }] )
    var dfk	= dict.fromkeys( ["40001","40002"], 1 )

    // test dict.fromkeys()
    assert( len(dfk) == 2 )
    assert( dfk.get('40001') == 1 )

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
    
    // test dict.get()
    assert( d.get('plc', null) === "xxplc1" )
    assert( d.get('nothing', 1) === 1 )
    assert( d.get('nothing') === null )
    assert( len(d) === 2 )

    // test dict.keys()
    assert( len(d.keys()) == 2 )

    // test dict.values()
    assert( len(d.values()) == 2 )

    // test dict.items()
    assert( len(d.items()) == 2 )

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
    l.extend(['your','mom'])
    assert( len(l) == 4 )
    assert( l[2] == 'your' )

    // test list.insert()
    l.insert(0, 'hot')
    assert( len(l) == 5 )
    assert( l[0] == 'hot' )

    // test list.remove()
    l.remove('hot')
    assert( len(l) == 4 )
    assert( l[0] == 'single' )

    // test list.pop()
    assert( l.pop() == 'single' )
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
    assert( "they're bill's friends.".title() == "They're Bill's Friends." )

    // test string.upper()
    assert( "hey".upper() == "HEY" )

    // test string.zfill()
    assert( "89".zfill(5) == "00089" )
    assert( "-89".zfill(5) == "-0089" )
    assert( "bill".zfill(8) == "0000bill" )
    assert( "-bill".zfill(8) == "-000bill" )
    


    console.log("Passed all "+passes+" tests");

    // iterrange = generator(function( start, stop ) {
    //     var current	= this.count + start;
    //     if( current <= stop ) {
    //         return current;
    //     }
    //     else {
    //         return undefined;
    //     }
    // });
    // range = iterrange(11, 30);
    // console.log(["range", range])

})(window);
