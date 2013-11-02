
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
        if( arguments.length == 1 && Array.isArray(arguments[0]) ) {
            return Array.apply( null, arguments[0])
        }
        else {
            return Array.apply( null, arguments)
        }
    }

    function dict() {
        // this checks if the Object is actually a dict like object
        if( arguments.length == 1
            && typeof( arguments[0].constructor.create ) == 'function' ) {
            return Object(arguments[0])
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
    
    // Array changes must be done before Object changes
    Object.defineProperties( Array.prototype, {
        "append": {
            value: Array.prototype.push
        }
    });
    
    Object.defineProperties( Object.prototype, {
        "get": {
            value: function( key, dflt ) {
                return this[key] || dflt === undefined
                    ? this[key]
                    : dflt;
            }
        },
        "keys": {
            value: function() {
                return Object.keys(this);
            }
        },
        "values": {
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
            value: function() {
                var items 	= []
                , keys		= this.keys()
                for( i=0; i<keys.length; i++ ) {
                    items.push( [ keys[i], this[keys[i]] ] )
                }
                return items;
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

    // Dict tests
    var d	= dict({
        "plc": "xxplc1",
        "registers": { "40001": 0 }
    })

    assert( d.get('plc', null) === "xxplc1" )
    assert( d.get('nothing', null) === null )
    assert( d.get('nothing') === undefined )
    assert( len(d) === 2 )

    // List tests
    var l	= list(['hello','world'])
    assert( len(l) === 2 )
    var l	= list('hello', {}, [])
    assert( len(l) === 3 )
    var l	= list("single")
    assert( len(l) === 1 )
    l.append("girls")
    assert( len(l) === 2 )
    
})(window);
