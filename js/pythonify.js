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
    
    function _in(iterable) {
        if( is_dict(iterable) ) {
            return iterable[this] !== undefined
                ? true : false;
        }
        else if( is_list(iterable) ) {
            var v = this.anchor !== undefined ? this.toString() : parseInt(this.toString())
            return iterable.indexOf(v) !== -1
                ? true : false;
        }
    }
    function _notIn(iterable) {
        if( is_dict(iterable) ) {
            return iterable[this] === undefined
                ? true : false;
        }
        else if( is_list(iterable) ) {
            var v = this.anchor !== undefined ? this.toString() : parseInt(this.toString())
            return iterable.indexOf(v) === -1
                ? true : false;
        }
    }
    
    Object.defineProperties( String.prototype, {
        "in": {
            writable: true,
            value: _in
        },
        "notIn": {
            writable: true,
            value: _notIn
        }
    });
    
    Object.defineProperties( Number.prototype, {
        "in": {
            writable: true,
            value: _in
        },
        "notIn": {
            writable: true,
            value: _notIn
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

})(window);
