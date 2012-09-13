build: compile test

test:
	@set -e
	@./node_modules/.bin/mocha --reporter spec -b -t 10000

compile:
	@./node_modules/.bin/coffee -c lib/requestah.coffee

install:
	@npm install --dev
		
.PHONY: test compile install
