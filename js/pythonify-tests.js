
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

    // Testing general functions

    // test len() for list and dict
    assert( len(['hello','world']) === 2 )
    assert( len({ 'text': 'hello', 'value': 'world' }) === 2 )
    

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
    assert( d.get('nothing', null) === null )
    assert( d.get('nothing') === undefined )
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

    // test dict.pop()
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
    var error;
    try {
        s.index('los');
    }
    catch(err) {
        error = err
    }
    assert( error == "ValueError" )
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
    var error;
    try {
        s.rindex('los');
    }
    catch(err) {
        error = err
    }
    assert( error == "ValueError" )
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

    iterrange = generator(function( start, stop ) {
        var current	= this.count + start;
        if( current <= stop ) {
            return current;
        }
        else {
            return undefined;
        }
    });
    range = iterrange(11, 30);
    console.log(["range", range])

})(window);
