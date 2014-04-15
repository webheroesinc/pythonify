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

    String.ascii_letters	= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    String.ascii_lowercase	= "abcdefghijklmnopqrstuvwxyz"
    String.ascii_uppercase	= "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    String.ascii_digits		= "0123456789"
    String.ascii_hexdigits	= "0123456789abcdefABCDEF"
    String.ascii_octdigits	= "01234567"
    String.ascii_letters	= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    String.punctuation		= "!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~"
    String.printable		= "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c"
    String.whitespace		= "\t\n\x0b\x0c\r "
    Object.defineProperties( String.prototype, {
        "repeat": {
            writable: true,
            value: function(len) {
                return new Array( len + 1 ).join( this );
            }
        },
        "capitalize": {
            writable: true,
            value: function() {
                return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
            }
        },
        "center": {
            writable: true,
            value: function(width, fillchar) {
                if( this.length >= width ) {
                    return this;
                }
                var fillchar	= fillchar ? fillchar : " ";
                var blen	= Math.ceil(  (width - this.length)/2 );
                var elen	= Math.floor( (width - this.length)/2 );
                var bstr	= new Array( blen + 1 ).join( fillchar );
                var estr	= new Array( elen + 1 ).join( fillchar );
                return bstr + this + estr;
            }
        },
        "count": {
            writable: true,
            value: function(sub, start, end) {
                return this.slice(start, end).split(sub).length - 1;
            }
        },
        "endswith": {
            writable: true,
            value: function(suffix, start, end) {
                var str		= this.slice(start, end)
                , needles	= typeof suffix == 'string' ? [suffix] : suffix;
                for( i in needles ) {
                    var n	= needles[i];
                    if( n.length > str.length ) {
                        continue;
                    }
                    if( n == str.substring( str.length - n.length ) ) {
                        return true;
                    }
                }
                return false;
            }
        },
        "replaceAt": {
            writable: true,
            value: function(index, str, length) {
                var i		= index - 1;
                return this.substring(0, i) + str + this.substring( i + (length ? length : 1) );
            }
        },
        "expandtabs": {
            writable: true,
            value: function(tabsize) {
                var results	= [];
                var tabsize	= tabsize === undefined ? 8 : tabsize;
                var lines	= this.split("\n");
                for( n in lines ) {
                    var line	= lines[n];
                    while( line.find("\t") != -1 ) {
                        var i	= line.find("\t");
                        line	= line.replaceAt( i+1, " ".repeat( tabsize - (i % tabsize) ) );
                    }
                    results.append(line);
                }
                return results.join("\n");
            }
        },
        "find": {
            writable: true,
            value: function( sub, start, end ) {
                return this.slice(start, end).indexOf( sub );
            }
        },
        "format": {
            writable: true,
            value: function() {
                var str		= this;
                for( var i=0; i < arguments.length; i++ ) {
                    var arg	= arguments[i];
                    if( is_dict(arg) ) {
                        for( k in arg ) {
                            var re	= new RegExp( RegExp.escape("{"+k+"}") );
                            str		= str.replace(re, arg[k]);
                        }
                    }
                    else {
                        var re	= new RegExp( RegExp.escape("{"+i+"}") );
                        str	= str.replace(re, arg);
                    }
                }
                return str;
            }
        },
        "index": {
            writable: true,
            value: function( sub, start, end ) {
                var r		= this.find(sub, start, end);
                if( r === -1 ) {
                    throw "ValueError";
                }
                return r;
            }
        },
        "isalnum": {
            writable: true,
            value: function() {
                return this.match( /^[a-z0-9]+$/i ) ? true : false;
            }
        },
        "isalpha": {
            writable: true,
            value: function() {
                return this.match( /^[a-z]+$/i ) ? true : false;
            }
        },
        "isdigit": {
            writable: true,
            value: function() {
                return this.match( /^[0-9]+$/ ) ? true : false;
            }
        },
        "islower": {
            writable: true,
            value: function() {
                return this.match( /^[a-z ]+$/ ) ? true : false;
            }
        },
        "isupper": {
            writable: true,
            value: function() {
                return this.match( /^[A-Z ]+$/ ) ? true : false;
            }
        },
        "isspace": {
            writable: true,
            value: function() {
                return this.match( /^[\s]+$/ ) ? true : false;
            }
        },
        "join": {
            writable: true,
            value: function( iter ) {
                return iter.join( this );
            }
        },
        "ljust": {
            writable: true,
            value: function( width, fillchar ) {
                var fillchar	= fillchar ? fillchar : " ";
                return this + fillchar.repeat( width - this.length );
            }
        },
        "lower": {
            writable: true,
            value: function() {
                return this.toLowerCase();
            }
        },
        "lstrip": {
            writable: true,
            value: function(chars) {
                var chars	= chars ? chars : " ";
                var re		= new RegExp( "^["+chars+"]*" );
                return this.replace(re, "");
            }
        },
        "partition": {
            writable: false,
            value: function( sep ) {
                if( sep === undefined ) {
                    throw "TypeError: partition() takes exactly one argument ("+arguments.length+" given)";
                }
                var index	= this.find(sep);
                return index
                    ? [ this.slice( 0, index ), sep, this.slice( index+1 ) ]
                    : [ this, "", "" ];
            }
        },
        "_replace": {
            writable: false,
            value: String.prototype.replace
        },
        "replace": {
            writable: true,
            value: function(pattern, replace, count) {
                var str		= this;
                var re		= new RegExp( pattern );
                if( count !== undefined ) {
                    var re	= new RegExp( re.source, [re.ignoreCase ? "i" : "", re.multiline ? "m" : ""].join("") );
                    for( var i=0; i < count; i++ ) {
                        str	= str._replace(re, replace);
                    }
                }
                else {
                    str		= str._replace(re, replace);
                }
                return str;
            }
        },
        "rfind": {
            writable: true,
            value: function( sub, start, end ) {
                return this.slice(start, end).lastIndexOf( sub );
            }
        },
        "rindex": {
            writable: true,
            value: function( sub, start, end ) {
                var r		= this.rfind(sub, start, end);
                if( r === -1 ) {
                    throw "ValueError";
                }
                return r;
            }
        },
        "rpartition": {
            writable: false,
            value: function( sep ) {
                if( sep === undefined ) {
                    throw "TypeError: partition() takes exactly one argument ("+arguments.length+" given)";
                }
                var index	= this.rfind(sep);
                return index
                    ? [ this.slice( 0, index ), sep, this.slice( index+1 ) ]
                    : [ this, "", "" ];
            }
        },
        "rjust": {
            writable: true,
            value: function( width, fillchar ) {
                var fillchar	= fillchar ? fillchar : " ";
                return fillchar.repeat( width - this.length ) + this;
            }
        },
        "rstrip": {
            writable: true,
            value: function(chars) {
                var chars	= chars ? chars : " ";
                var re		= new RegExp( "["+chars+"]*$" );
                return this.replace(re, "");
            }
        },
        "_split": {
            writable: true,
            value: String.prototype.split
        },
        "split": {
            writable: true,
            value: function( sep, maxsplit ) {
                var maxsplit	= maxsplit === undefined ? maxsplit : maxsplit + 1;
                var splits	= this._split( sep || ' ', maxsplit );
                return sep === undefined && len(splits) == 1 && splits[0] == "" ? [] : splits;
            }
        },
        "splitlines": {
            writable: true,
            value: function( keepends ) {
                var splits	= this._split("\n");
                if( keepends === true ) {
                    for( i in splits ) {
                        splits[i]      += "\n"
                    }
                }
                return splits;
            }
        },
        "startswith": {
            writable: true,
            value: function(suffix, start, end) {
                var str		= this.slice(start, end)
                , needles	= typeof suffix == 'string' ? [suffix] : suffix;
                for( i in needles ) {
                    var n	= needles[i];
                    if( n.length > str.length ) {
                        continue;
                    }
                    if( n == str.substring( 0, n.length ) ) {
                        return true;
                    }
                }
                return false;
            }
        },
        "strip": {
            writable: true,
            value: function(chars) {
                return this.lstrip(chars).rstrip(chars);
            }
        },
        "swapcase": {
            writable: true,
            value: function(chars) {
                var str		= this;
                for( var i=0; i < str.length; i++ ) {
                    var c	= str.charAt(i);
                    if( c === c.upper() ) {
                        str	= str.replaceAt(i+1, c.lower());
                    }
                    else {
                        str	= str.replaceAt(i+1, c.upper());
                    }
                }
                return str;
            }
        },
        "title": {
            writable: true,
            value: function() {
                var words	= this.split(' ');
                for( i in words ) {
                    words[i]	= words[i].capitalize();
                }
                return words.join(' ');
            }
        },
        "upper": {
            writable: true,
            value: function() {
                return this.toUpperCase();
            }
        },
        "zfill": {
            writable: true,
            value: function( width ) {
                var sign	= this.startswith('-');
                return (sign ? '-' : '') + this.slice( sign ? 1 : 0 ).rjust( sign ? width-1 : width, '0' );
            }
        }
    });

    RegExp.escape = function(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    
    // Object property definitions must be done last
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
        },
        "join": {
            writable: true,
            value: function( str ) {
                return this.keys().join( str );
            }
        }
    });

    // usage:
    // 
    // range = generator(function( start, stop ) {
    //     if( this.count + start < stop )
    //         return this.count++;
    //     else
    //         return null;
    // });
    // 
    function generator( fn, args ) {
        if( !( this instanceof generator )) {
            return new generator( fn, args );
        }

        console.log(['generator', fn])
        this._fn	= fn;
        var t		= this;
        if( args ) {

            this._args	= args;
            this.count	= 0;
            return this;
        }
        else {
            return function () {
                return t.create.apply( t, arguments )
            }
        }
    }
    generator.prototype.create = function() {
        console.log(['create', this._fn])
        return new generator( this._fn, arguments );
    }
    generator.prototype.next = function() {
        var ret = this._fn.apply( this, this._args );
        this.count++;
        return ret;
    }
    generator.prototype.add_arg = function( item ) {
        [].push.call( this._args, item );
        return this._args.length;
    }

    window.len		= len
    window.list		= list
    window.dict		= dict
    window.generator	= generator

})(window);
