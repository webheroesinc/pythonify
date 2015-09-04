
// Pythonify -- Library that implements Python like methods in JavaScript.
// 
// Copyright © 2014, Web Heroes Inc.
//
// This file is part of Pythonify
//
// Pythonify is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function(window) {
    
    var py		= function(obj) {
        if (is_dict(obj)) {
            Object.defineProperties( obj, object_props );
        }
        else if (is_list(obj)) {
            Object.defineProperties( obj, array_props );
        }
        else if (is_string(obj)) {
            obj		=  _string(obj);
            Object.defineProperties( obj, string_props );
        }
        else if (is_number(obj)) {
            obj		=  _number(obj);
            Object.defineProperties( obj, number_props );
        }
        return obj;
    }
    
    var is_complex = function (obj) {
        return is_dict(obj) || is_list(obj) || is_window(obj) ? true : false;
    }
    py.is_complex	= is_complex;

    var is_window = function (obj) {
        window.asdfghjkl = true;
        var answer	= obj.asdfghjkl === true;
        delete window.asdfghjkl;
        return answer;
    }
    py.is_window	= is_window;

    var is_dict = function (obj) {
        if( obj.callee !== undefined ) {
            return false;
        }
        if( obj.constructor.name == 'Object'
            || is_window(obj) ) {
            return true;
        }
        return false;
    }
    py.is_dict		= is_dict;

    var is_list = function (array) {
        if( Array.isArray(array) ) {
            return true;
        }
        return false;
    }
    py.is_list		= is_list;

    var is_tuple	= function (t) {
        if( isinstance(t, tuple) && Object.isFrozen(t) ) {
            return true;
        }
        return false;
    }
    py.is_tuple		= is_tuple;

    var is_string	= function (str) {
        String.prototype.tinkerbell	= true;
        var answer	= str.tinkerbell === true;
        delete String.prototype.tinkerbell;
        return answer;
    }
    py.is_string	= is_string;

    var is_number	= function (num) {
        Number.prototype.tinkerbell	= true;
        var answer	= num.tinkerbell === true;
        delete Number.prototype.tinkerbell;
        return answer;
    }
    py.is_number	= is_number;

    var is_iterable = function (iter) {
        if( iter.length !== undefined && typeof iter !== 'string' ) {
            return true;
        }
        return false;
    }
    py.is_iterable	= is_iterable;

    function len( iter ) {
        var length = 0;
        if( iter.length )
            return iter.length;
        if( is_complex(iter) ) {
            var keys	= iter.keys();
            length	= keys.length;
        }
        return length || 0;
    }
    py.len		= len

    function tuple(iter) {
        if( ! isinstance(this, tuple) ) {
            return new tuple(iter);
        }
        var sequence	= is_dict(iter) ? iter.keys() : iter.copy();
        for( i in sequence ) {
            this.append(sequence[i]);
        }
        Object.freeze(this);
    }
    tuple.prototype		= new Array();
    Object.defineProperties( tuple.prototype, {
        constructor: {
            writable: true,
            value: tuple
        },
        __str__: {
            writable: true,
            value: function() {
                return this.__repr__();
            }
        },
        __repr__: {
            writable: true,
            value: function() {
                return '('+map(function(x) { return str(x) }, this).join(",")+')';
            }
        }
    });
    py.tuple	= tuple

    function list() {
        if( arguments.length == 1 && is_iterable(arguments[0]) ) {
            return Array.apply( null, arguments[0])
        }
        else {
            return Array.apply( null, arguments)
        }
    }
    py.list		= list

    function dict() {
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
            a[seq[i]] = v;
        }
        return a
    }
    py.dict		= dict

    function abs(x) {
        return Math.abs(x);
    }
    py.abs = abs;
    function all(iter) {
        var sequence	= is_dict(iter) ? iter.keys() : iter;
        for( var i in sequence ) {
            if( ! sequence[i] ) {
                return false;
            }
        }
        return true;
    }
    py.all = all;
    function any(iter) {
        var sequence	= is_dict(iter) ? iter.keys() : iter;
        for( var i in sequence ) {
            if( sequence[i] ) {
                return true;
            }
        }
        return false;
    }
    py.any = any;
    function bin(x) {
        return x.toString(2)
    }
    py.bin = bin;
    function bool(x) {
        return x ? true : false;
    }
    py.bool = bool;
    function callable(obj) {
        return typeof obj === "function" ? true : false;
    }
    py.callable = callable;
    function chr(i) {
        if( i >= 0 && i < 256 ) {
            return String.fromCharCode(i);
        }
        else {
            throw "ValueError: chr() arg not in range(256)";
        }
    }
    py.chr = chr;
    function cmp(x,y) {
        return x < y ? -1 : x === y ? 0 : x > y ? 1 : null;
    }
    py.cmp = cmp;
    // py.compile:	Not sure if Javascript can do this
    // py.complex:	mathjs.org does this
    function delattr(obj, name) {
        if( arguments.length !== 2 ) {
            throw "TypeError: delattr() takes exactly two argument ("+arguments.length+" given)"
        }
        delete obj[name];
    }
    py.delattr = delattr;
    // py.dir:	Not sure if you can iterate over hidden properties
    function divmod(a,b) {
        if( arguments.length !== 2 ) {
            throw "TypeError: divmod() takes exactly two argument ("+arguments.length+" given)";
        }
        return [Math.floor(a/b), a % b];
    }
    py.divmod = divmod;
    function iterate(iter, callback, scope) {
        var sequence	= is_dict(iter) ? iter.keys() : iter;
        sequence.iterate( callback, scope );
    }
    py.iterate = iterate;
    function enumerate(iter, callback, scope, start) {
        var sequence	= is_dict(iter) ? iter.keys() : iter;
        sequence.enumerate( callback, scope, start );
    }
    py.enumerate = enumerate;
    // py.eval:	Figure out a way to make eval ONLY handle expressions
    function filter(callback, iter) {
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
    py.filter = filter;
    // py.format:	Later...
    function frozenset(iter) {
        var sequence	= is_dict(iter)
            ? iter.keys()
            : iter.copy();
        return Object.freeze(sequence);
    }
    py.frozenset = frozenset;
    function float(x) {
        return parseFloat(x);
    }
    py.float = float;
    function getattr(obj, name, dflt) {
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
    py.getattr = getattr;
    function globals() {
        return window;
    }
    py.globals = globals;
    function hasattr(obj, name) {
        if( arguments.length < 2 ) {
            throw "TypeError: hasattr() takes at least two argument ("+arguments.length+" given)";
        }
        return obj[name] === undefined ? false : true;
    }
    py.hasattr = hasattr;
    // py.hash:	Not sure what python's hash does
    // py.help:	??? possibly N/A
    function hex(n) {
        return (n < 0 ? "-" : "") + "0x"+abs(n).toString(16);
    }
    // This isn't working as nicely as I could like.
    py.hex = hex;
    function id(obj) {
        return obj.__id__();
    }
    py.id = id;
    function input(text) {
        return eval(prompt(text));
    }
    py.input = input;
    function raw_input(text) {
        return prompt(text);
    }
    py.raw_input = raw_input;
    function int(x, base) {
        return x === undefined ? 0 : base === undefined ? parseInt(x) : parseInt(x).toString(base);
    }
    py.int = int;
    function isinstance(obj, classinfo) {
        if( is_window(obj) )
            return false;
        if( obj instanceof classinfo )
            return true;
        if( new obj.constructor() instanceof classinfo )
            return true;
        return false;
    }
    py.isinstance = isinstance;
    function issubclass(cls, classinfo) {
        return new cls instanceof classinfo;
    }
    py.issubclass = issubclass;
    function iter(o, sentinel) {
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
    py.iter = iter;
    // py.locals:	??? would be the same as globals
    // py.long:	??? would be the same as int
    function map(callback) {
        if( len(arguments) < 2 ) {
            throw "TypeError: map() takes at least two arguments ("+arguments.length+" given)";
        }
        var iterlist	= [];
        for( var i=1; i < arguments.length; i++ ) {
            var arg	= arguments[i];
            if( is_dict(arg) ) {
                iterlist.append( arg.keys() );
            }
            // else if( is_tuple(arg) ) {
            //     iterlist.append( arg );
            // }
            else {
                iterlist.append( new Array().slice.apply(arg) );
            }
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
    py.map = map;
    function max() {
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
    py.max = max;
    function min() {
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
    py.min = min;
    // py.next:	Need to implement iterators/generators better
    function object(n) {
        return new Object();
    }
    py.object = object;
    function oct(n) {
        return (n < 0 ? "-" : "") + "0"+abs(n).toString(8);
    }
    py.oct = oct;
    // py.open:	No file handling
    function ord(i) {
        if( i.length === 1 ) {
            return i.charCodeAt(0);
        }
        else {
            throw "TypeError: ord() expected a character, but string of length "+i.length+" found";
        }
    }
    py.ord = ord;
    function pow(x, y, z) {
        return z === undefined ? Math.pow(x, y) : Math.pow(x, y) % z;
    }
    py.pow = pow;
    function range() {
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
    py.range = range;
    // py.print:	??? What to do for print?
    function reduce(callback, iter, initializer) {
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
    py.reduce = reduce;
    // py.reload:	No concept for modules yet
    function repr(obj) {
        return obj.__repr__ === undefined ? obj.toString() : obj.__repr__();
    }
    py.repr = repr;
    function reversed(iter) {
        if( iter.__reversed__ === undefined ) {
            throw "TypeError: argument to reversed() must be a sequence";
        }
        return iter.__reversed__();
    }
    py.reversed = reversed;
    function round(n, ndigits) {
        var modifier	= pow(10, ndigits === undefined ? 0 : ndigits );
        return Math.round(n*modifier)/modifier;
    }
    py.round = round;
    // py.set:	Later...
    function setattr(obj, name, value) {
        if( arguments.length !== 3 ) {
            throw "TypeError: setattr() takes exactly three arguments ("+arguments.length+" given)";
        }
        obj[name] = value;
    }
    py.setattr = setattr;
    // py.slice:	Seems kinda useless, look into some examples
    function sorted(iter, cmp, key, reverse) {
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
            b.append(keys[i]);
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
            var l	= seqkeymap.pop(sid);
            result.extend( l || [] );
        }
        return result;
    }
    py.sorted = sorted;
    function str(obj) {
        if( obj === undefined )
            return 'Undefined';
        if( obj === null )
            return 'None';
        return obj.__str__ === undefined ? obj.toString() : obj.__str__();
    }
    py.str = str;
    function sum(iter, start) {
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
    py.sum = sum;
    function Super(classinfo, obj) {
        if( ! isinstance(obj, classinfo) ) {
            throw "obj must be an instance of classinfo";
        }
        var parent	= classinfo.prototype.__parent__;

        if( py.__clones__ === undefined ) {
            py.__clones__	= {};
        }
        if( py.__clones__[id(parent)] !== undefined ) {
            return new py.__clones__[id(parent)]();
        }

        var proto_props	= Object.getOwnPropertyNames(parent.prototype);
        var clone	= function() {};
        for( i in proto_props ) {
            var prop	= proto_props[i];
            if( callable(parent.prototype[prop]) ) {
                (function(p) {
                    clone.prototype[prop] = function() {
                        var result = parent.prototype[p].apply( obj, arguments );
                        return result;
                    }
                })(prop);
            }
            else {
                clone.prototype[prop] = parent.prototype[prop];
            }
        }
        py.__clones__[id(parent)] = clone;
        return new clone();
    }
    py.Super = Super;
    function type(obj) {
        if( obj === undefined )
            throw "TypeError: type() takes exactly one argument ("+arguments.length+" given)";
        if( is_tuple(obj) ) {
            return "Tuple";
        }
        return obj.constructor.name;
    }
    py.type = type;
    // py.unichr	Not implementing unicode things
    // py.unicode	Not implementing unicode things
    // py.vars	Later...
    // py.xrange	Later...
    function zip() {
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
    py.zip = zip;
    function subclass(classinfo, methods, name) {
        if( arguments.length === 0 )
            throw "TypeError: subclass() takes at least one argument (0 given)";
        if( methods !== undefined && methods !== null && ! is_dict(methods) )
            throw "TypeError: methods must be a dict object";

        var init_func	=
            "var __tmpclass = function"+(name ? " "+name : "" )+"() {\
            \n    if( py.isinstance( this, "+(name || "__tmpclass")+" ) ) {\
            \n        return methods.__init__ === undefined\
            \n            ? this\
            \n            : methods.__init__.apply(this, arguments);\
            \n    }\
            \n    else {\
            \n        return new "+(name || "__tmpclass")+"();\
            \n    }\
            \n};";

        eval( init_func );

        __tmpclass.prototype	= new classinfo();

        if( name !== undefined ) {
            methods.__name__			= name;
        }
        
        methods.constructor	= __tmpclass;
        methods.__parent__	= classinfo;
        props			= {};
        for( key in methods || {} ) {
            props[key]	= {
                writable: true,
                value: methods[key]
            }
        }
        Object.defineProperties( __tmpclass.prototype, props );

        return __tmpclass;
    }
    py.subclass = subclass;

    var function_props = {
        "__repr__": {
            writable: true,
            value: function() {
                return "<function "+(this.name === "" ? "anonymous" : this.name)+">";
            }
        }
    };
    
    var array_props = {
        "append": {
            writable: true,
            value: function() {
                return Array.prototype.push.apply(this, arguments);
            }
        },
        "extend": {
            writable: true,
            value: function(arr) {
                for( var i in arr ) {
                    var k	= arr[i];
                    this.append(k)
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
                var i	= index === undefined ? len(this)-1 : index
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
        "iterate": {
            writable: true,
            value: function(callback, scope) {
                for( i in this ) {
                    callback.call(scope || this, this[i]);
                }
            }
        },
        "enumerate": {
            writable: true,
            value: function(callback, scope, start) {
                for( var i=(start || 0); i < this.length; i++ ) {
                    callback.call(scope || this, i, this[i]);
                }
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
                return "["+map( str, this ).join(",")+"]";
            }
        },
        "__reversed__": {
            writable: true,
            value: function() {
                return this.reverse();
            }
        }
    };
    
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
    
    var number_props = {
        "in": {
            writable: true,
            value: _in
        },
        "notIn": {
            writable: true,
            value: _notIn
        }
    };
    
    var string_props = {
        "in": {
            writable: true,
            value: _in
        },
        "notIn": {
            writable: true,
            value: _notIn
        },
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
                            var re	= new RegExp( RegExp.escape("{"+k+"}"), 'g' );
                            str		= str.replace(re, arg[k]);
                        }
                    }
                    else {
                        var re	= new RegExp( RegExp.escape("{"+i+"}"), 'g' );
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
        "istitle": {
            writable: true,
            value: function() {
                return str(this) === str(this.title());
            }
        },
        "join": {
            writable: true,
            value: function( iter ) {
                var sequence = is_dict(iter) ? iter.keys() : iter;
                return sequence.join( this );
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
        "rsplit": {
            writable: true,
            value: function( sep, maxsplit ) {
                var split = this.split(sep);
                return maxsplit
                    ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit))
                    : split;
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
                var words	= this._split(/[^a-zA-Z]/);
                var spacers	= this._split(/[a-zA-Z]+/);
                var str		= spacers[0];
                for( var i in words ) {
                    str		+= words[i].capitalize() + ( spacers[Number(i)+1] || '' );
                }
                return str;
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
        },
        "__str__": {
            writable: true,
            value: function() {
                return this.substr();
            }
        }
    };

    var string_attrs = {
        ascii_letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        ascii_lowercase: "abcdefghijklmnopqrstuvwxyz",
        ascii_uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        ascii_digits: "0123456789",
        ascii_hexdigits: "0123456789abcdefABCDEF",
        ascii_octdigits: "01234567",
        ascii_letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        punctuation: "!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~",
        printable: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c",
        whitespace: "\t\n\x0b\x0c\r "
    }

    RegExp.escape = function(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    
    var object_props = {
        "iter": {
            writable: true,
            value: function() {
                return this.keys();
            }
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
        "Get": {
        // "get" is, for some reason, considered a getter function even when on a prototype and not
        // a property definition which causes any Object.defineProperty( Object.prototype, ...)
        // later in the script to fail with the error:
        // 
        //     TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>
        //     
        // This can be fixed by capitalizing the G to make "Get".
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
                    var item	= tuple([ keys[i], this[keys[i]] ]);
                    items.push( item );
                }
                return items;
            }
        },
        "iteritems": {
            writable: true,
            value: function(callback, scope) {
                var keys	= this.keys();
                for( var i=0; i<keys.length; i++ ) {
                    var t	= tuple([keys[i], this[keys[i]]])
                    callback.call( scope || this, t[0], t[1], t );
                }
            }
        },
        "keys": {
            writable: true,
            value: function() {
                return Object.keys(this);;
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
        "__id__": {
            writable: true,
            value: function() {
                if( py.__id === undefined ) {
                    py.__id = 0;
                }
                if( this.____id === undefined ) {
                    Object.defineProperty( this, "____id", {
                        value: ++py.__id
                    });
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
    };

    // // Code below is not being used for anything yet...
    // function utf8_encode(argString) {
    //     //  discuss at: http://phpjs.org/functions/utf8_encode/
    //     // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    //     // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //     // improved by: sowberry
    //     // improved by: Jack
    //     // improved by: Yves Sucaet
    //     // improved by: kirilloid
    //     // bugfixed by: Onno Marsman
    //     // bugfixed by: Onno Marsman
    //     // bugfixed by: Ulrich
    //     // bugfixed by: Rafal Kukawski
    //     // bugfixed by: kirilloid
    //     //   example 1: utf8_encode('Kevin van Zonneveld');
    //     //   returns 1: 'Kevin van Zonneveld'

    //     if (argString === null || typeof argString === 'undefined') {
    //         return '';
    //     }

    //     // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    //     var string = (argString + '');
    //     var utftext = '',
    //     start, end, stringl = 0;

    //     start = end = 0;
    //     stringl = string.length;
    //     for (var n = 0; n < stringl; n++) {
    //         var c1 = string.charCodeAt(n);
    //         var enc = null;

    //         if (c1 < 128) {
    //             end++;
    //         } else if (c1 > 127 && c1 < 2048) {
    //             enc = String.fromCharCode(
    //                 (c1 >> 6) | 192, (c1 & 63) | 128
    //             );
    //         } else if ((c1 & 0xF800) != 0xD800) {
    //             enc = String.fromCharCode(
    //                 (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
    //             );
    //         } else {
    //             // surrogate pairs
    //             if ((c1 & 0xFC00) != 0xD800) {
    //                 throw new RangeError('Unmatched trail surrogate at ' + n);
    //             }
    //             var c2 = string.charCodeAt(++n);
    //             if ((c2 & 0xFC00) != 0xDC00) {
    //                 throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
    //             }
    //             c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
    //             enc = String.fromCharCode(
    //                 (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
    //             );
    //         }
    //         if (enc !== null) {
    //             if (end > start) {
    //                 utftext += string.slice(start, end);
    //             }
    //             utftext += enc;
    //             start = end = n + 1;
    //         }
    //     }

    //     if (end > start) {
    //         utftext += string.slice(start, stringl);
    //     }

    //     return utftext;
    // }

    // function sha1(str) {
    //     //  discuss at: http://phpjs.org/functions/sha1/
    //     // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    //     // improved by: Michael White (http://getsprink.com)
    //     // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //     //    input by: Brett Zamir (http://brett-zamir.me)
    //     //  depends on: utf8_encode
    //     //   example 1: sha1('Kevin van Zonneveld');
    //     //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

    //     var rotate_left = function(n, s) {
    //         var t4 = (n << s) | (n >>> (32 - s));
    //         return t4;
    //     };

    //     var cvt_hex = function(val) {
    //         var str = '';
    //         var i;
    //         var v;

    //         for (i = 7; i >= 0; i--) {
    //             v = (val >>> (i * 4)) & 0x0f;
    //             str += v.toString(16);
    //         }
    //         return str;
    //     };

    //     var blockstart;
    //     var i, j;
    //     var W = new Array(80);
    //     var H0 = 0x67452301;
    //     var H1 = 0xEFCDAB89;
    //     var H2 = 0x98BADCFE;
    //     var H3 = 0x10325476;
    //     var H4 = 0xC3D2E1F0;
    //     var A, B, C, D, E;
    //     var temp;

    //     str = utf8_encode(str);
    //     var str_len = str.length;

    //     var word_array = [];
    //     for (i = 0; i < str_len - 3; i += 4) {
    //         j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
    //         word_array.push(j);
    //     }

    //     switch (str_len % 4) {
    //     case 0:
    //         i = 0x080000000;
    //         break;
    //     case 1:
    //         i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
    //         break;
    //     case 2:
    //         i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
    //         break;
    //     case 3:
    //         i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
    //             8 | 0x80;
    //         break;
    //     }

    //     word_array.push(i);

    //     while ((word_array.length % 16) != 14) {
    //         word_array.push(0);
    //     }

    //     word_array.push(str_len >>> 29);
    //     word_array.push((str_len << 3) & 0x0ffffffff);

    //     for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    //         for (i = 0; i < 16; i++) {
    //             W[i] = word_array[blockstart + i];
    //         }
    //         for (i = 16; i <= 79; i++) {
    //             W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    //         }

    //         A = H0;
    //         B = H1;
    //         C = H2;
    //         D = H3;
    //         E = H4;

    //         for (i = 0; i <= 19; i++) {
    //             temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
    //             E = D;
    //             D = C;
    //             C = rotate_left(B, 30);
    //             B = A;
    //             A = temp;
    //         }

    //         for (i = 20; i <= 39; i++) {
    //             temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
    //             E = D;
    //             D = C;
    //             C = rotate_left(B, 30);
    //             B = A;
    //             A = temp;
    //         }

    //         for (i = 40; i <= 59; i++) {
    //             temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
    //             E = D;
    //             D = C;
    //             C = rotate_left(B, 30);
    //             B = A;
    //             A = temp;
    //         }

    //         for (i = 60; i <= 79; i++) {
    //             temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
    //             E = D;
    //             D = C;
    //             C = rotate_left(B, 30);
    //             B = A;
    //             A = temp;
    //         }

    //         H0 = (H0 + A) & 0x0ffffffff;
    //         H1 = (H1 + B) & 0x0ffffffff;
    //         H2 = (H2 + C) & 0x0ffffffff;
    //         H3 = (H3 + D) & 0x0ffffffff;
    //         H4 = (H4 + E) & 0x0ffffffff;
    //     }

    //     temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    //     return temp.toLowerCase();
    // }

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
    py.generator	= generator;
    
    function bind() {
        Object.defineProperties( Array.prototype, array_props );
        Object.defineProperties( String.prototype, string_props );
        Object.defineProperties( Number.prototype, number_props );
        Object.defineProperties( Object.prototype, object_props );
        
        for (var k in string_attrs) {
            String[k]	= string_attrs[k];
        }

        for (var fn in py) {
            window[fn]	= py[fn];
        }
    }
    py.bind		= bind;
    
    var _string		= py.subclass( String, {
        __init__: function() {
        }
    });
    Object.defineProperties( _string.prototype, string_props );

    var _number		= py.subclass( Number, {
        __init__: function() {
        }
    });
    Object.defineProperties( _number.prototype, number_props );
    Object.defineProperties( Function.prototype, function_props );
    
    module.exports	= py;
})(global);
