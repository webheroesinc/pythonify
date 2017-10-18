
.PHONY:		all package
.SILENT:	all package

all:
	echo   ""
	echo   "	tests		- Run tests"
	echo   "	minify		- Minify code with uglifyjs"
	echo   "	package		- Show instructions for making bower package"
	echo   ""

package:
	echo "run:"
	echo "  $ git tag v<major>.<minor>.<patch>"
	echo ""
	echo "more info: http://bower.io/docs/creating-packages/#maintaining-dependencies"

minify:
	cd js; uglifyjs -mc -o pythonify.min.js pythonify.js;

tests:
	cd nodejs/tests; nodejs pythonify_test.js | bunyan
