
build: components index.js
	@component build --dev

dist: components index.js
	@component build -s array -o ./dist

components: component.json
	@component install --dev

test:
	@./node_modules/mocha/bin/mocha --reporter spec

clean:
	rm -fr build components template.js

.PHONY: clean test
