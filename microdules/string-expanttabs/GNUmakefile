
all:
	echo ""
	echo "tests		Run the tests"
	echo "publish		Publish public package to npm"
	echo ""

tests:
	mocha tests.js | bunyan

publish:
	npm publish --access public
