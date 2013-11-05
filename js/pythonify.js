
console.log("Ready");

(function(window) {

    // Object -> Dict
    // Array -> List
    // Function
    // String

    function extend(x, y) {
        for(var key in y) {
            if (y.hasOwnProperty(key)) {
                x[key] = y[key];
            }
        }
        return x;
    }

    function is_dict(obj) {
        if( typeof( obj.constructor.create ) == 'function' ) {
            return true
        }
        return false
    }

    function is_list(array) {
        if( Array.isArray(array) ) {
            return true
        }
        return false
    }

    function is_iterable(iter) {
        if( iter.length !== undefined && typeof iter !== 'string' ) {
            return true
        }
        return false
    }

    function len( iter ) {
        var length = 0;
        if( iter instanceof Array ) {
            length	= iter.length
        }
        else if( iter instanceof Object ) {
            for( key in iter ) {
                if (iter.hasOwnProperty(key)) length++;
            }
        }
        return length;
    }

    function list() {
        if( arguments.length == 1 && is_iterable(arguments[0]) ) {
            return Array.apply( null, arguments[0])
        }
        else {
            return Array.apply( null, arguments)
        }
    }

    function dict() {
        // this checks if the Object is actually a dict like object
        if( arguments.length == 1
            && is_dict( arguments[0] ) ) {
            return arguments[0]
        }
        else {
            var d = {}
            for( i in arguments ) {
                if( arguments[i].length == 2 ) {
                    d[arguments[i][0]] = arguments[i][1]
                }
                else {
                    continue
                }
            }
            return d
        }
    }
    dict.fromkeys = function( seq, value ) {
        var a	= {}
        , v	= value ? value : null;
        for( i in seq ) {
            a[seq[i]] = value
        }
        return a
    }
    
    // Array changes must be done before Object changes
    Object.defineProperties( Array.prototype, {
        "append": {
            writable: true,
            value: Array.prototype.push
        },
        "extend": {
            writable: true,
            value: function(arr) {
                for( i in arr ) {
                    this.append(arr[i])
                }
            }
        },
        "insert": {
            writable: true,
            value: function(index, value) {
                var i = index === undefined ? 0 : index
                this.splice(i,0,value)
            }
        },
        "remove": {
            writable: true,
            value: function(value) {
                var i = this.indexOf(value)
                this.splice(i,1)
            }
        },
        "pop": {
            writable: true,
            value: function(index) {
                var i	= index === undefined ? 0 : index
                , v	= this[i]
                this.splice(i,1)
                return v
            }
        },
        "index": {
            writable: true,
            value: function(value) {
                return this.indexOf(value)
            }
        },
        "count": {
            writable: true,
            value: function(value) {
                var c = 0
                for( i in this ) {
                    this[i] === value ? c++ : null;
                }
                return c
            }
        }
    });

    Object.defineProperties( String.prototype, {
        "in": {
            writable: true,
            value: function(iterable) {
                if( is_dict(iterable) ) {
                    return iterable[this] !== undefined
                        ? true : false;
                }
                else if( is_list(iterable) ) {
                    return iterable.indexOf(this.toString()) !== -1
                        ? true : false;
                }
            }
        },
        "notIn": {
            writable: true,
            value: function(iterable) {
                if( is_dict(iterable) ) {
                    return iterable[this] === undefined
                        ? true : false;
                }
                else if( is_list(iterable) ) {
                    return iterable.indexOf(this.toString()) === -1
                        ? true : false;
                }
            }
        }
    });
    
    Object.defineProperties( Object.prototype, {
        "get": {
            writable: true,
            value: function( key, dflt ) {
                return this[key] || dflt === undefined
                    ? this[key]
                    : dflt;
            }
        },
        "keys": {
            writable: true,
            value: function() {
                return Object.keys(this);
            }
        },
        "values": {
            writable: true,
            value: function() {
                var values 	= []
                , keys		= this.keys()
                for( i=0; i<keys.length; i++ ) {
                    values.push( this[keys[i]] )
                }
                return values;
            }
        },
        "items": {
            writable: true,
            value: function() {
                var items 	= []
                , keys		= this.keys()
                for( i=0; i<keys.length; i++ ) {
                    items.push( [ keys[i], this[keys[i]] ] )
                }
                return items;
            }
        },
        "clear": {
            writable: true,
            value: function() {
                keys	= this.keys()
                for( i in keys ) {
                    delete this[keys[i]]
                }
            }
        },
        "copy": {
            writable: true,
            value: function() {
                var copy = {}
                for( i in this ) {
                    copy[i] = this[i]
                }
                return copy
            }
        },
        "pop": {
            writable: true,
            value: function(key, dflt) {
                if( key.in(this) ) {
                    var v = this[key]
                    delete this[key]
                    return v
                }
                else {
                    return dflt;
                }
            }
        },
        "setdefault": {
            writable: true,
            value: function(key, dflt) {
                if( key.in(this) ) {
                    return this[key]
                }
                else {
                    var v = dflt === undefined ? null : dflt
                    this[key] = v
                    return this[key];
                }
            }
        },
        "update": {
            writable: true,
            value: function() {
                var d = dict.apply( null, arguments)
                for( i in d ) {
                    this[i] = d[i]
                }
                return null
            }
        }
    });

    window.len		= len
    window.list		= list
    window.dict		= dict

    // Run tests
    function assert(condition, message) {
        if (!condition) {
            throw message || "Assertion failed";
        }
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

})(window);
