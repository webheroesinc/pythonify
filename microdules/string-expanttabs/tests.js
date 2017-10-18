
const expect		= require('chai').expect;
const expandtabs	= require('./index.js');
const py		= expandtabs.symbol;

describe("@pythonify/expandtabs", function() {
    it("should work", function() {
	expect("Hello\tWorld"[py].expandtabs()).to.equal("Hello   World")
	expect("Hello\tWorld"[py].expandtabs(7)).to.equal("Hello  World")
	expect("Hello\tWorld"[py].expandtabs(4)).to.equal("Hello   World")
	
	expect("\tHello\n\tWorld"[py].expandtabs(4)).to.equal("    Hello\n    World" );
	expect("\tHello\t\n\tWorld"[py].expandtabs(4)).to.equal("    Hello   \n    World" );

	expect(() => "Hello\tWorld"[py].expandtabs("")		).to.throw(TypeError, 'argument must be')
    });
});
