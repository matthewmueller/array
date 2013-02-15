
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

dist: dist-build dist-minify

test:
	@./node_modules/mocha/bin/mocha --reporter spec

dist-build:
	@component build -s array -o dist -n array

dist-minify: dist/array.js
	@curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@$<" \
		http://closure-compiler.appspot.com/compile \
		> $<.tmp
	@mv $<.tmp dist/array.min.js

clean:
	rm -fr build components template.js

.PHONY: clean test build dist
