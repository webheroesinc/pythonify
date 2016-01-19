
;(function() {
    try {
	var global		= window;
	var browser		= true;
    } catch (err) {
	var browser		= false;
    }
    
    if (browser) {
	var log		= {};
	var lvls	= ["error", "warn", "info", "debug", "trace"];
	for (var i in lvls) {
	    log[lvls[i]]	= function() {}
	}
    }
    else {
	var bunyan	= require('bunyan')
	var log		= bunyan.createLogger({
	    name: "Pythonify",
	    level: 'error'
	});
    }
    
    var is		= {
	existy: function(value) {
	    return value !== null && value !== undefined;
	},
	regexp: function(value) {
	    return Object.prototype.toString.call(value) === '[object RegExp]';
	},
	array: Array.isArray || function(value) {
	    return Object.prototype.toString.call(value) === '[object Array]';
	},
	object: function(value) {
	    return Py.type(value) === 'Object';
	}
    };
    is.not		= {
	existy: function(value) {
	    return !is.existy.call(null, value);
	}
    };
    

    function Pythonify(obj) {
	var type		= Py.type(obj)
	if (type === 'String')
	    return Py.String(obj);
	else if (type === 'Number')
	    return Py.Number(obj);
	else if (type === 'Array')
	    return Py.Array(obj);
	else if (type === 'Object')
	    return Py.Object(obj);
	else
	    throw Error("Pythonify does not support type: "+type);
    }
    var Py			= Pythonify;
    Py.bind		= function(type) {
	if (is.not.existy(type))
	    type		= 'all';
	switch (type.toLowerCase()) {
	case 'string':
	    bindPythonify(String, Py.String.prototype);
	    break;
	case 'number':
	    bindPythonify(Number, Py.Number.prototype);
	    break;
	case 'array':
	    bindPythonify(Array, Py.Array.prototype);
	    break;
	case 'object':
	    bindPythonify(Object, Py.Object.prototype);
	    break;
	case 'all':
	    bindPythonify(String, Py.String.prototype);
	    bindPythonify(Number, Py.Number.prototype);
	    bindPythonify(Array, Py.Array.prototype);
	    bindPythonify(Object, Py.Object.prototype);
	    break;
	default:
	    throw Error("Unrecognized binding type: "+type);
	    break;
	}
    }
    Py.type		= function(obj) {
	var type		= typeof obj;
	if (obj === null)
	    return 'Null';
	if (obj === undefined)
	    return 'Undefined';
	
	var cName		= obj.constructor && obj.constructor.name;
	if (type === 'object')
	    return cName;
	else
	    return type.charAt(0).toUpperCase() + type.slice(1);
    }
    Py.len		= function(obj) {
	if (Py.type(obj) === 'Array' || Py.type(obj) === 'String')
	    return obj.length;
	else if (Py.type(obj) === 'Object')
	    return Object.keys(obj).length;
	else
	    throw Error("Cannot get length of type '"+Py.type(obj)+"'");
    }
    Py.iterable	= function(iter) {
	return typeof iter === 'string' || typeof iter === 'object';
    }
    Py.isBoolean	= function (n) {
	return Py.type(n) === 'Boolean';
    }
    Py.isString	= function (s) {
	return Py.type(s) === 'String';
    }
    Py.isNumber	= function (n) {
	return Py.type(n) === 'Number';
    }
    Py.isArray	= function (a) {
	return Py.type(a) === 'Array';
    }
    Py.isObject	= function (o) {
	return Py.type(o) === 'Object';
    }


    function bindPythonify(Class, methods) {
	Object.defineProperty(Class.prototype, '$py', {
	    writable: true,
	    value: function() {
		if (this.__$pynested__ === false) {
		    bindMethods(this, methods, this);
		    Object.defineProperty(this, '__$pynested__', {
			value: true
		    });
		}
		return this;
	    }
	});
	Object.defineProperty(Class.prototype, '__$pynested__', {
	    writable: true,
	    value: false
	});
	return Class;
    }
    function bindMethods(obj, methods, context) {
	log.trace("Loading methods");
	if (is.not.existy(context))
	    context		= obj;
	
	for (var n in methods) {
	    (function(n, ctx) {
		Object.defineProperty(obj, n, {
		    writable: true,
		    value: function() {
			log.trace("Calling method", n);
			return methods[n].apply(ctx, arguments);
		    }
		})
	    })(n, context);
	}
	return obj;
    }

    Py.String	= function(str) {
	obj			= new String(str);
	bindMethods(obj, Py.String.prototype);
	return obj;
    }
    Py.String.prototype		= {
	repeat: function(n) {
	    requireNumber(n);
	    
            return n<=0 ? '' : new Array(n+1).join(this);
	},
	capitalize: function() {
            return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	},
	endswith: function(suffix, start, end) {
	    requireString(suffix);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
	    var str		= this.slice(start, end);
	    var needles		= typeof suffix == 'string' ? [suffix] : suffix;
	    for( var i in needles ) {
		var n		= needles[i];
		if( n.length > str.length ) {
		    continue;
		}
		if( n == str.substring( str.length - n.length ) ) {
		    return true;
		}
	    }
	    return false;
	},
	startswith: function(suffix, start, end) {
	    requireString(suffix);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            var str		= this.slice(start, end);
            var needles		= typeof suffix == 'string' ? [suffix] : suffix;
            for( var i in needles ) {
		var n		= needles[i];
		if( n.length > str.length ) {
                    continue;
		}
		if( n == str.substring( 0, n.length ) ) {
                    return true;
		}
            }
            return false;
	},
	center: function(w, fchar) {
	    requireNumber(w);
	    is.existy(fchar) && requireString(fchar, "Second");

	    var l		= this.length;
            if(l >= w)
		return this.slice();
	    
            var fillchar	= fchar ? fchar : " ";
            var blen		= Math.ceil( (w - l)/2 );
            var elen		= Math.floor((w - l)/2 );
            var bstr		= new Array( blen + 1 ).join( fchar );
            var estr		= new Array( elen + 1 ).join( fchar );
	    
            return bstr+this+estr;
	},
	count: function(sub, start, end) {
	    requireString(sub);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            return this.slice(start, end).split(sub).length - 1;
	},
	replaceAt: function(index, str, length) {
	    requireNumber(index);
	    requireString(str, "Second");
	    is.existy(length) && requireNumber(length, "Third");
	    
            var i		= index-1;
            return this.substring(0, i)+str+this.substring(i+(length ? length : 1));
	},
	find: function( sub, start, end ) {
	    requireString(sub);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            return this.slice(start, end).indexOf( sub );
	},
	format: function() {
            var str		= this;
            for( var i=0; i < arguments.length; i++ ) {
		var arg	= arguments[i];
		if( Py.type(arg) === 'Object' ) {
                    for( var k in arg ) {
			var re	= new RegExp( Py.RegExp.escape("{"+k+"}"), 'g' );
			str	= str.replace(re, arg[k]);
                    }
		}
		else {
                    var re	= new RegExp( Py.RegExp.escape("{"+i+"}"), 'g' );
                    str	= str.replace(re, arg);
		}
            }
            return str;
	},
	expandtabs: function(tabsize) {
	    is.existy(tabsize) && requireNumber(tabsize);
	    
            var results		= [];
            var tabsize		= is.not.existy(tabsize) ? 8 : tabsize;
            var lines		= this.split("\n");
            for( var n in lines ) {
		var line	= lines[n];
		while( S.find(line, "\t") !== -1 ) {
                    var i	= S.find(line, "\t");
                    var line	= S.replaceAt(line, i+1, S.repeat(" ", tabsize - (i % tabsize) ) );
		}
		results.push(line);
            }
            return results.join("\n");
	},
	index: function(sub, start, end) {
	    requireString(sub);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            var r		= S.find(this, sub, start, end);
            if( r === -1 )
		throw new Error("Substring '"+sub+"' not found in '"+this.slice(start, end)+"'");
            return r;
	},
	join: function( iter ) {
	    if (!Py.iterable(iter))
		throw Error("Can only join an iterable.  Type '"+Py.type(iter)+"' given");

	    var seq		= Py.type(iter) === 'Array'
		? iter
		: Py.type(iter) === 'String' ? iter.slice().split('') : Object.keys(iter);
            return seq.join(this);
	},
	ljust: function( w, fchar ) {
	    requireNumber(w);
	    is.existy(fchar) && requireString(fchar, "Second");
	    
            var fchar		= is.not.existy(fchar) ? " " : fchar;
            return this + S.repeat(fchar, w-this.length);
	},
	lower: function() {
            return this.toLowerCase();
	},
	lstrip: function(chars) {
	    is.existy(chars) && requireString(chars);
	    
            var chars		= chars ? chars : " ";
            var re		= new RegExp( "^["+chars+"]*" );
            return this.replace(re, "");
	},
	partition: function( sep ) {
            if( is.not.existy(sep) )
		throw new Error("partition() takes exactly one argument ("+arguments.length+" given)");
	    requireString(sep);

            var i		= S.find(this, sep);
            return i
		? [ this.slice(0, i), sep, this.slice(i+1) ]
		: [ this.slice(), "", "" ];
	},
	isalnum: function() {
            return this.match( /^[a-z0-9]+$/i ) ? true : false;
	},
	isalpha: function() {
            return this.match( /^[a-z]+$/i ) ? true : false;
	},
	isdigit: function() {
            return this.match( /^[0-9]+$/ ) ? true : false;
	},
	islower: function() {
            return this.match( /^[a-z ]+$/ ) ? true : false;
	},
	isupper: function() {
            return this.match( /^[A-Z ]+$/ ) ? true : false;
	},
	isspace: function() {
            return this.match( /^[\s]+$/ ) ? true : false;
	},
	istitle: function() {
            return String(this) === S.title(this);
	},
	rfind: function( sub, start, end ) {
	    requireString(sub);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            return this.slice(start, end).lastIndexOf(sub);
	},
	rindex: function( sub, start, end ) {
	    requireString(sub);
	    is.existy(start) && requireNumber(start, "Second");
	    is.existy(end) && requireNumber(end, "Third");
	    
            var r		= S.rfind(this, sub, start, end);
            if( r === -1 ) {
		throw new Error("ValueError");
            }
            return r;
	},
	rpartition: function( sep ) {
            if( is.not.existy(sep) )
		throw new Error("TypeError: rpartition() takes exactly one argument ("+arguments.length+" given)");
	    requireString(sep);
	    
            var index		= S.rfind(this, sep);
            return index
		? [ this.slice( 0, index ), sep, this.slice( index+1 ) ]
		: [ this, "", "" ];
	},
	rjust: function( w, fchar ) {
	    requireNumber(w);
	    is.existy(fchar) && requireString(fchar, "Second");
	    
            var fchar		= fchar ? fchar : " ";
            return S.repeat(fchar, w-this.length )+this;
	},
	rstrip: function(chars) {
	    is.existy(chars) && requireString(chars);
	    
            var chars		= is.not.existy(chars) ? " " : chars;
            var re		= new RegExp( "["+chars+"]*$" );
            return this.replace(re, "");
	},
	rsplit: function( sep, max ) {
	    is.existy(sep) && ( is.regexp(sep) || requireString(sep) );
	    is.existy(max) && requireNumber(max);

	    if (is.not.existy(sep))
		sep		= " ";
            var splits		= S.split(this, sep);
            return max
		? [ splits.slice(0, -max).join(sep) ].concat(splits.slice(-max))
		: splits;
	},
	split: function( sep, max ) {
	    is.existy(sep) && ( is.regexp(sep) || requireString(sep) );
	    is.existy(max) && requireNumber(max);
	    
	    if (is.not.existy(sep))
		sep		= " ";
            var max		= is.not.existy(max) ? max : max;
            var splits		= String.prototype.split.call(this, sep);

            return max && splits.length > max
		? splits.slice(0, max).concat([ splits.slice(max).join(sep) ])
		: splits;
	},
	splitlines: function( keepends ) {
	    is.existy(keepends) && requireBoolean(keepends);
	    
            var splits		= S.split(this, "\n");
            if( keepends === true )
		splits		= splits.map(function(line) { return line+"\n"; });
            return splits;
	},
	strip: function(chars) {
            return S.rstrip( S.lstrip(this, chars), chars );
	},
	swapcase: function() {
            var str		= this;
            for( var i=0; i < str.length; i++ ) {
		var c		= str.charAt(i);
		if( c === c.toUpperCase() )
                    str		= S.replaceAt(str, i+1, c.toLowerCase());
		else
                    str		= S.replaceAt(str, i+1, c.toUpperCase());
            }
            return str;
	},
	title: function() {
            var words		= S.split(this, /[^a-zA-Z]/);
            var spacers		= S.split(this, /[a-zA-Z]+/);
            var str		= spacers[0];
            for( var i in words )
		str		+= S.capitalize(words[i]) + ( spacers[Number(i)+1] || '' );
            return str;
	},
	upper: function() {
            return this.toUpperCase();
	},
	zfill: function( w ) {
	    requireNumber(w);
	    
            var sign		= S.startswith(this, '-');
            return (sign ? '-' : '') + S.rjust(this.slice( sign ? 1 : 0 ), sign ? w-1 : w, '0' );
	}
    };

    Py.Number	= function(num) {
	obj			= new Number(num);
	bindMethods(obj, Py.Number.prototype);
	return obj;
    }
    Py.Number.prototype		= {
    };
    Py.Array	= function(arr) {
	bindMethods(arr, Py.Array.prototype);
	return arr;
    }
    Py.Array.prototype		= {
        append: function() {
            return Array.prototype.push.apply(this, arguments);
        },
        extend: function(arr) {
	    requireArray(arr);
	    
            for( var i in arr )
                this.push(arr[i]);
        },
        insert: function(index, value) {
	    is.existy(index) && requireNumber(index);
	    
            var i = index === undefined ? 0 : index
            this.splice(i,0,value)
	},
        remove: function(value) {
            var i = this.indexOf(value)
            this.splice(i,1)
        },
        pop: function(index) {
	    is.existy(index) && requireNumber(index);
	    
            var i	= index === undefined ? this.length-1 : index;
            var v	= this[i];
            this.splice(i,1);
            return v;
        },
        index: function(value) {
            return this.indexOf(value);
        },
        count: function(value) {
            var c = 0;
            for( var i in this )
                this[i] === value ? c++ : null;
            return c;
        },
        copy: function() {
            return this.slice();
        }
    };
    Py.Object	= function(obj) {
	// var decoy	= {};
	bindMethods(obj, Py.Object.prototype, obj);
	return obj;
	// return decoy;
    }
    Py.Object.prototype		= {
        clear: function() {
            for( var k in this )
                delete this[k];
        },
        copy: function() {
            var copy		 = {};
            for( var i in this )
                copy[i] = this[i];
            return copy;
        },
        get: function( key, dflt ) {
	    requireString(key);
	    
            return this[key] !== undefined
                ? this[key]
                : dflt || undefined;
        },
        keys: function() {
            return Object.keys(this);;
        },
        pop: function(key, dflt) {
	    requireString(key);

	    var keys		= Object.keys(this);
	    var index		= keys.indexOf(key);
            if( index === -1 )
                return dflt;
            else {
		var key		= keys[index];
                var v		= this[key];
                delete this[key];
                return v;
            }
        },
        popitem: function() {
	    var keys		= Object.keys(this);
	    return keys[0] === undefined
		? undefined
		: O.pop(this, keys[0]);
        },
        setdefault: function(key, dflt) {
	    requireString(key);
	    requireExisty(dflt, "Second");
	    
	    var keys		= Object.keys(this);
            if( keys.indexOf(key) === -1 ) {
                this[key]	= dflt;
                return this[key];
            }
            else
                return this[key];
        },
        update: function(obj) {
	    requireObject(obj);

            for( var i in obj )
                this[i]		= obj[i];
        },
        values: function() {
            var values	 	= [];
            var keys		= O.keys(this);
            for(var i in keys)
                values.push( this[keys[i]] );
            return values;
        },
    }
    Py.RegExp	= function(obj) {
	return obj;
    }
    Py.RegExp.escape = function(str) {
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // Create shortcuts to prototype methods for reference in prototype methods
    function createShortcutMethods(methods, type) {
	var obj		= {};
	for(var k in methods) {
	    (function(k) {
		obj[k]	= function() {
		    var args	= Array.prototype.slice.call(arguments);
		    var ctx	= args[0];
		    if ( Py.type(ctx) !== type )
			throw Error("Context for method '"+methods[k]+"' must be a string. Type '"+Py.type(ctx)+"' given");
		    return methods[k].apply(ctx, args.slice(1));
		}
	    })(k);
	}
	return obj;
    }

    var S		= createShortcutMethods(Py.String.prototype, 'String');
    var N		= createShortcutMethods(Py.Number.prototype, 'Number');
    var A		= createShortcutMethods(Py.Array.prototype, 'Array');
    var O		= createShortcutMethods(Py.Object.prototype, 'Object');

    // Extras
    function requireBoolean(b, arg_num) {
	if (!Py.isBoolean(b))
	    throw Error((arg_num||"First")+" argument must be a boolean.  Type '"+Py.type(b)+"' given");
    }
    function requireString(s, arg_num) {
	if (!Py.isString(s))
	    throw Error((arg_num||"First")+" argument must be a string.  Type '"+Py.type(s)+"' given");
    }
    function requireNumber(n, arg_num) {
	if (!Py.isNumber(n))
	    throw Error((arg_num||"First")+" argument must be a number.  Type '"+Py.type(n)+"' given");
    }
    function requireArray(a, arg_num) {
	if (!Py.isArray(a))
	    throw Error((arg_num||"First")+" argument must be an array.  Type '"+Py.type(a)+"' given");
    }
    function requireObject(o, arg_num) {
	if (!Py.isObject(o))
	    throw Error((arg_num||"First")+" argument must be an object.  Type '"+Py.type(o)+"' given");
    }
    function requireExisty(x, arg_num) {
	if (!is.existy(x))
	    throw Error((arg_num||"First")+" argument must exist.  Type '"+Py.type(x)+"' given");
    }

    if (browser)
	global.Pythonify	= Py;
    else
	module.exports		= Py;
})();
