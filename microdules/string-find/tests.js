
const expect		= require('chai').expect;
const find		= require('./index.js');
const py		= find.symbol;

describe("@pythonify/find", function() {
    it("should work", function() {
	expect("Hello World"[py].find('World')).to.equal(6)
	expect("Hello World"[py].find('World', 6)).to.equal(0)
	expect("Hello World"[py].find('World', 6, 7)).to.equal(-1)

	expect(() => "Hello World"[py].find(1)		).to.throw(TypeError, 'argument must be')
	expect(() => "Hello World"[py].find("", null)	).to.throw(TypeError, 'argument must be')
	expect(() => "Hello World"[py].find("", 1, null)).to.throw(TypeError, 'argument must be')
    });
});
