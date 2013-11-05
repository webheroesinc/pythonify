
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

    console.log("Passed all "+passes+" tests");

})(window);
