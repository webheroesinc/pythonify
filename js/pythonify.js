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

    window.is_complex = function(obj) {
        return is_dict(obj) || is_list(obj) ? true : false;
    }

    window.is_dict = function(obj) {
        if( obj.callee !== undefined ) {
            return false;
        }
        if( obj.constructor.name == 'Object' || obj.constructor.name == 'Window' ) {
            return true
        }
        return false
    }

    window.is_list = function(array) {
        if( Array.isArray(array) ) {
            return true
        }
        return false
    }

    window.is_iterable = function(iter) {
        if( iter.length !== undefined && typeof iter !== 'string' ) {
            return true
        }
        return false
    }

    function len( iter ) {
        var length = 0;
        if( is_complex(iter) ) {
            var keys	= iter.keys();
            for( var i in keys ) {
                var key	= keys[i];
                if (iter.hasOwnProperty(key)) length++;
            }
        }
        else if( iter.length ) {
            return iter.length;
        }
        return length;
    }
    window.len		= len

    function tuple(iter) {
        var sequence	= is_dict(iter) ? iter.keys() : iter.copy();
        return Object.freeze(sequence)
    }
    window.tuple	= tuple

    function list() {
        if( arguments.length == 1 && is_iterable(arguments[0]) ) {
            return Array.apply( null, arguments[0])
        }
        else {
            return Array.apply( null, arguments)
        }
    }
    window.list		= list

    function dict() {
        // this checks if the Object is actually a dict like object
        if( arguments.length == 1
            && is_dict( arguments[0] ) ) {
            var d	= {};
            var iter	= arguments[0];
            var keys	= Object.keys(iter);
            for( var i in keys ) {
                var k	= keys[i];
                d[k]	= iter[k];
            }
            return d;
        }
        else {
            var d = {};
            for( var i in arguments ) {
                if( arguments[i].length == 2 ) {
                    d[arguments[i][0]] = arguments[i][1];
                }
                else {
                    continue;
                }
            }
            return d
        }
    }
    dict.fromkeys = function( seq, value ) {
        var a	= {}
        , v	= value ? value : null;
        for( var i in seq ) {
            a[seq[i]] = value
        }
        return a
    }
    window.dict		= dict

    window.abs = function(x) {
        return Math.abs(x);
    }
    window.all = function(iter) {
        for( var i in iter ) {
            if( ! iter[i] ) {
                return false;
            }
        }
        return true;
    }
    window.any = function(iter) {
        for( var i in iter ) {
            if( iter[i] ) {
                return true;
            }
        }
        return false;
    }
    window.bin = function(x) {
        return x.toString(2)
    }
    window.bool = function(x) {
        return x ? true : false;
    }
    window.callable = function(obj) {
        return typeof obj === "function" ? true : false;
    }
    window.chr = function(i) {
        if( i >= 0 && i < 256 ) {
            return String.fromCharCode(i);
        }
        else {
            throw "ValueError: chr() arg not in range(256)";
        }
    }
    window.cmp = function(x,y) {
        return x < y ? -1 : x === y ? 0 : x > y ? 1 : null;
    }
    // window.compile:	Not sure if Javascript can do this
    // window.complex:	mathjs.org does this
    window.delattr = function(obj, name) {
        if( arguments.length !== 2 ) {
            throw "TypeError: delattr() takes exactly two argument ("+arguments.length+" given)"
        }
        delete obj[name];
    }
    // window.dir:	Not sure if you can iterate over hidden properties
    window.divmod = function(a,b) {
        if( arguments.length !== 2 ) {
            throw "TypeError: divmod() takes exactly two argument ("+arguments.length+" given)";
        }
        return [Math.floor(a/b), a % b];
    }
    window.enumerate = function(sequence, start) {
        var results	= [];
        var sequence	= is_dict(sequence) ? sequence.keys() : sequence;
        var start	= start === undefined ? 0 : start;
        for( var i=start; i < sequence.length; i++ ) {
            results.append( [i, sequence[i]] );
        }
        return results;
    }
    // window.eval:	Figure out a way to make eval ONLY handle expressions
    window.filter = function(callback, iter) {
        var results	= [];
        var sequence	= is_dict(iter) ? iter.keys() : iter;
        for( var i=0; i < sequence.length; i++ ) {
            var x	= sequence[i];
            if( callback( x ) === true ) {
                results.append( x );
            }
        }
        return results;
    }
    // window.format:	Later...
    window.frozenset = function(iter) {
        var sequence	= is_dict(iter)
            ? iter.keys()
            : iter.copy();
        return Object.freeze(sequence);
    }
    window.float = function(x) {
        return parseFloat(x);
    }
    window.getattr = function(obj, name, dflt) {
        if( arguments.length < 2 ) {
            throw "TypeError: getattr() takes at least two argument ("+arguments.length+" given)";
        }
        if( obj[name] === undefined ) {
            if( dflt === undefined ) {
                throw "AttributeError: type object '"+(obj.name ? obj.name : obj.constructor.name)+"' has no attribute '"+name+"'";
            }
            else {
                return dflt;
            }
        }
        return obj[name];
    }
    window.globals = function() {
        return dict(window);
    }
    window.hasattr = function(obj, name) {
        if( arguments.length < 2 ) {
            throw "TypeError: hasattr() takes at least two argument ("+arguments.length+" given)";
        }
        return obj[name] === undefined ? false : true;
    }
    // window.hash:	Not sure what python's hash does
    // window.help:	??? possibly N/A
    window.hex = function(n) {
        return (n < 0 ? "-" : "") + "0x"+abs(n).toString(16);
    }
    // This isn't working as nicely as I could like.
    window.id = function(obj) {
        return obj.__id__();
    }
    window.input = function(text) {
        return eval(prompt(text));
    }
    window.raw_input = function(text) {
        return prompt(text);
    }
    window.int = function(x, base) {
        return x === undefined ? 0 : base === undefined ? parseInt(x) : parseInt(x).toString(base);
    }
    window.isinstance = function(obj, classinfo) {
        return obj.constructor.name.lower() == classinfo.name.lower();
    }
    window.issubclass = function(cls, classinfo) {
        return new cls instanceof classinfo;
    }
    window.iter = function(o, sentinel) {
        if( sentinel === undefined ) {
            return is_dict(o)
                ? o.keys()
                : o.copy();
        }
        else {
            var r	= [];
            var v	= o();
            while( v !== sentinel ) {
                r.append(v);
                v	= o();
            }
            return r;
        }
    }
    // window.locals:	??? would be the same as globals
    // window.long:	??? would be the same as int
    window.map = function(callback) {
        if( len(arguments) < 2 ) {
            throw "TypeError: map() takes at least two arguments ("+arguments.length+" given)";
        }
        var iterlist	= [];
        for( var i=1; i < arguments.length; i++ ) {
            var arg	= arguments[i];
            iterlist.append( is_dict(arg) ? arg.keys() : new Array().slice.apply(arg) );
        }
        var exhausted	= false;
        var result	= [];
        while( exhausted === false ) {
            exhausted	= true;
            var cb_args	= [];
            for( var i in iterlist ) {
                var arg		= iterlist[i].pop();
                cb_args.append( arg );
                if( arg !== undefined )
                    exhausted	= false;
            }
            if( exhausted === false )
                result.append( callback.apply(null, cb_args) );
        }
        return result;
    }
    window.max = function() {
        var key		= undefined;
        var sequence	= new Array().slice.apply(arguments);
        if( callable( arguments[arguments.length-1] ) ) {
            key		= arguments[arguments.length-1];
            sequence	= sequence.slice(0,-1);
        }
        if( len(sequence) === 1 ) {
            var iter	= sequence[0];
            sequence	= is_dict(iter) ? iter.keys() : iter;
        }
        var match	= sequence[0];
        var maxvalue	= key === undefined ? match : key( match );
        for( var i=1; i < sequence.length; i++ ) {
            var v	= sequence[i];
            var m	= key === undefined ? v : key( v );
            if( m > maxvalue ) {
                maxvalue	= m;
                match		= v;
            }
        }
        return match;
    }
    window.min = function() {
        var key		= undefined;
        var sequence	= new Array().slice.apply(arguments);
        if( callable( arguments[arguments.length-1] ) ) {
            key		= arguments[arguments.length-1];
            sequence	= sequence.slice(0,-1);
        }
        if( len(sequence) === 1 ) {
            var iter	= sequence[0];
            sequence	= is_dict(iter) ? iter.keys() : iter;
        }
        var match	= sequence[0];
        var minvalue	= key === undefined ? match : key( match );
        for( var i=1; i < sequence.length; i++ ) {
            var v	= sequence[i];
            var m	= key === undefined ? v : key( v );
            if( m < minvalue ) {
                minvalue	= m;
                match		= v;
            }
        }
        return match;
    }
    // window.next:	Need to implement iterators/generators better
    window.object = function(n) {
        return new Object();
    }
    window.oct = function(n) {
        return (n < 0 ? "-" : "") + "0"+abs(n).toString(8);
    }
    // window.open:	No file handling
    window.ord = function(i) {
        if( i.length === 1 ) {
            return i.charCodeAt(0);
        }
        else {
            throw "TypeError: ord() expected a character, but string of length "+i.length+" found";
        }
    }
    window.pow = function(x, y, z) {
        return z === undefined ? Math.pow(x, y) : Math.pow(x, y) % z;
    }
    window.range = function() {
        if( len(arguments) === 0 ) {
            throw "TypeError: range() takes at least one argument ("+arguments.length+" given)";
        }
        var start	= 0;
        var stop	= undefined;
        var step	= arguments[2] === undefined ? 1 : arguments[2];
        if( step === 0 ) {
            throw "ValueError: range() step argument must not be zero";
        }
        if( len(arguments) === 1 ) {
            stop	= arguments[0];
        }
        else {
            start	= arguments[0];
            stop	= arguments[1];
        }
        var r		= [];
        if( step > 0 ) {
            for( var i=start; i < stop; i+=step ) {
                r.append(i);
            }
        }
        else if( step < 0 ) {
            for( var i=start; i > stop; i+=step ) {
                r.append(i);
            }
        }
        return r;
    }
    // window.print:	??? What to do for print?
    window.reduce = function(callback, iter, initializer) {
        if( len(iter) === 0 && initializer === undefined ) {
            throw "reduce() of empty sequence with no initial value";
        }
        var sequence	= is_dict( iter ) ? iter.keys() : iter.copy();
        var accum_value	= initializer === undefined ? sequence.pop() : initializer;
        for( var i in sequence ) {
            var x	= sequence[i];
            accum_value = callback( accum_value, x );
        }
        return accum_value;
    }
    // window.reload:	No concept for modules yet
    window.repr = function(obj) {
        return obj.__repr__ === undefined ? obj.toString() : obj.__repr__();
    }
    window.reversed = function(iter) {
        if( iter.__reversed__ === undefined ) {
            throw "TypeError: argument to reversed() must be a sequence";
        }
        return iter.__reversed__();
    }
    window.round = function(n, ndigits) {
        var modifier	= pow(10, ndigits === undefined ? 0 : ndigits );
        return Math.round(n*modifier)/modifier;
    }
    // window.set:	Later...
    window.setattr = function(obj, name, value) {
        if( arguments.length !== 3 ) {
            throw "TypeError: setattr() takes exactly three arguments ("+arguments.length+" given)";
        }
        obj[name] = value;
    }
    // window.slice:	Seems kinda useless, look into some examples
    window.sorted = function(iter, cmp, key, reverse) {
        if( arguments.length === 0 ) {
            throw "TypeError: sorted() takes at least one argument (0 given)";
        }
        // keys is the list we want to return at the end but in the right order
        // if key is defined: sort list of keys made by key function otherwise sort this list directly
        var keys	= is_dict( iter ) ? iter.keys() : iter.copy();
        var sequence	= key === undefined ? keys : map( key, keys );
        var seqkeymap	= {};
        for( var i in sequence ) {
            var v	= sequence[i];
            var sid	= is_complex(v) ? id( v ) : v;
            var b	= seqkeymap.setdefault(sid, []);
            b.append(keys[i])
            var c	= seqkeymap.setdefault(sid, []);
        }
        if( cmp === undefined ) {
            sortedseq	= reverse === true ? sequence.sort().reverse() : sequence.sort();
        }
        else {
            sortedseq	= sequence.sort( function(x,y) { return reverse === true ? -cmp(x,y) : cmp(x,y) } );
        }
        var result	= [];
        for( var i in sortedseq ) {
            var v	= sortedseq[i];
            var sid	= is_complex(v) ? id( v ) : v;
            var t	= seqkeymap[sid];
            var l	= seqkeymap.pop(sid);
            result.extend( l || [] );
        }
        return result;
    }
    window.str = function(obj) {
        if( obj === undefined )
            return '';
        return obj.__str__ === undefined ? obj.toString() : obj.__str__();
    }
    window.sum = function(iter, start) {
        if( arguments.length === 0 )
            throw "TypeError: sum() takes at least one argument (0 given)";
        if( arguments.length > 2 )
            throw "TypeError: sum() takes at most two argument ("+arguments.length+" given)";
        if( start !== undefined && typeof start !== "number" )
            throw "TypeError: start argument can only be an number";

        var sequence	= is_dict(iter) ? iter.keys() : iter.copy();
        var total	= reduce(function(x,y) { return x+y }, sequence, start);

        if( typeof total == "string" )
            throw "TypeError: sum() can only handle numbers";

        return total;
    }
    window.type = function(obj) {
        if( obj === undefined )
            throw "TypeError: type() takes exactly one argument ("+arguments.length+" given)";
        if( is_list(obj) && Object.isFrozen(obj) ) {
            return "Tuple";
        }
        return obj.constructor.name;
    }
    // window.unichr	Not implementing unicode things
    // window.unicode	Not implementing unicode things
    // window.vars	Later...
    // window.xrange	Later...
    window.zip = function() {
        var ziplist	= [];
        var minlen	= min( map( function(x) { return len(x) }, arguments ) );
        for( var a=0; a < minlen; a++ ) {
            var args	= [];
            for( var i=0; i < arguments.length; i++ ) {
                var arg	= arguments[i];
                args.append( arg );
            }
            ziplist.append( tuple(args) );
        }
        return ziplist;
    }
    

    
    Object.defineProperties( Array.prototype, {
        "append": {
            writable: true,
            value: Array.prototype.push
        },
        "extend": {
            writable: true,
            value: function(arr) {
                var keys	= arr.keys();
                for( var i in keys ) {
                    var k	= keys[i];
                    this.append(arr[k])
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
                for( var i in this ) {
                    this[i] === value ? c++ : null;
                }
                return c
            }
        },
        "copy": {
            writable: true,
            value: function() {
                return this.slice();
            }
        },
        "__reversed__": {
            writable: true,
            value: function() {
                return this.reverse();
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
                for( var i in needles ) {
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
                for( var n in lines ) {
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
                        for( var k in arg ) {
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
            writable: true,
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
            writable: true,
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
            writable: true,
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
                    for( var i in splits ) {
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
                for( var i in needles ) {
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
                for( var i in words ) {
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
        "iter": {
            writable: true,
            value: Object.prototype.keys
        },
        "clear": {
            writable: true,
            value: function() {
                var keys = this.keys()
                for( var i in keys ) {
                    delete this[keys[i]]
                }
            }
        },
        "copy": {
            writable: true,
            value: function() {
                var copy = {}
                for( var i in this ) {
                    copy[i] = this[i]
                }
                return copy
            }
        },
        "get": {
            writable: true,
            value: function( key, dflt ) {
                return this[key] !== undefined
                    ? this[key]
                    : dflt || null;
            }
        },
        "items": {
            writable: true,
            value: function() {
                var items 	= []
                , keys		= this.keys()
                for( var i=0; i<keys.length; i++ ) {
                    items.push( [ keys[i], this[keys[i]] ] )
                }
                return items;
            }
        },
        "keys": {
            writable: true,
            value: function() {
                var keys	= Object.keys(this);
                var filtered	= [];
                for( var i in keys ) {
                    if( ! keys[i].in( ['____id'] ) ) {
                        filtered.append( keys[i] );
                    }
                }
                return filtered;
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
        "popitem": {
            writable: true,
            value: function() {
                return this.pop( this.keys()[0] );
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
                for( var i in d ) {
                    this[i] = d[i]
                }
                return null
            }
        },
        "values": {
            writable: true,
            value: function() {
                var values 	= []
                , keys		= this.keys()
                for( var i=0; i<keys.length; i++ ) {
                    values.push( this[keys[i]] )
                }
                return values;
            }
        },
        "join": {
            writable: true,
            value: function( str ) {
                return this.keys().join( str );
            }
        },
        "__id__": {
            writable: true,
            value: function() {
                if( window.__id === undefined ) {
                    window.__id = 0;
                }
                if( this.____id === undefined ) {
                    this.____id	= ++window.__id;
                }
                return this.____id;
            }
        },
        "__str__": {
            writable: true,
            value: function() {
                return this.__repr__();
            }
        },
        "__repr__": {
            writable: true,
            value: function() {
                return JSON.stringify(this);
            }
        }
    });

    function utf8_encode(argString) {
        //  discuss at: http://phpjs.org/functions/utf8_encode/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: sowberry
        // improved by: Jack
        // improved by: Yves Sucaet
        // improved by: kirilloid
        // bugfixed by: Onno Marsman
        // bugfixed by: Onno Marsman
        // bugfixed by: Ulrich
        // bugfixed by: Rafal Kukawski
        // bugfixed by: kirilloid
        //   example 1: utf8_encode('Kevin van Zonneveld');
        //   returns 1: 'Kevin van Zonneveld'

        if (argString === null || typeof argString === 'undefined') {
            return '';
        }

        // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var string = (argString + '');
        var utftext = '',
        start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                );
            } else if ((c1 & 0xF800) != 0xD800) {
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            } else {
                // surrogate pairs
                if ((c1 & 0xFC00) != 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    }

    function sha1(str) {
        //  discuss at: http://phpjs.org/functions/sha1/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Michael White (http://getsprink.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    input by: Brett Zamir (http://brett-zamir.me)
        //  depends on: utf8_encode
        //   example 1: sha1('Kevin van Zonneveld');
        //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

        var rotate_left = function(n, s) {
            var t4 = (n << s) | (n >>> (32 - s));
            return t4;
        };

        var cvt_hex = function(val) {
            var str = '';
            var i;
            var v;

            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        var blockstart;
        var i, j;
        var W = new Array(80);
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;

        str = utf8_encode(str);
        var str_len = str.length;

        var word_array = [];
        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                8 | 0x80;
            break;
        }

        word_array.push(i);

        while ((word_array.length % 16) != 14) {
            word_array.push(0);
        }

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++) {
                W[i] = word_array[blockstart + i];
            }
            for (i = 16; i <= 79; i++) {
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            }

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    }
    

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
    window.generator	= generator

})(window);
