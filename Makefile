SHELL := /bin/bash

WC_PKG = @gip-recia/ui-webcomponents
WC_DIR = /packages/ui-webcomponents/dist
RELEASE_TYPES = patch minor major

 help default:
	@echo "📦 Available commands"
	@echo
	@echo " init                             > Initialize project"
	@echo " clean                            > Clean project"
	@echo " dedupe                           > De-duplicate yarn dependencies"
	@echo " license                          > Generate missing licenses"
	@echo " wc-build                         > Build web components"
	@echo " wc-release-[patch|minor|major]   > Create a release"
	@echo " wc-publish                       > Publish to npm"

.PHONY: \
	help \
	default \
	git-status-ok \
	check-main \
	check-wc-build \
	init \
	clean \
	dedupe \
	license \
	license-check \
	license-generate \
	license-commit \
	wc-build \
	wc-release-% \
	wc-publish

# Utilities

git-status-ok:
	@if ! git diff --quiet || ! git diff --cached --quiet; then \
		echo "❌ Tracked files have been modified (working tree or index)"; \
		exit 1; \
	fi

check-main:
	@if ! git symbolic-ref --quiet --short HEAD | grep -qx main; then \
		echo "❌ You are not on main branch"; \
		exit 1; \
	fi

check-wc-build:
	@JS_DIR="$$PWD$(WC_DIR)"; \
	if [ ! -d "$$JS_DIR" ]; then \
		echo "❌ You need to build web components"; \
		exit 1; \
	fi; \
	if find "$$JS_DIR" -type f -mmin +5 | grep -q .; then \
		echo "❌ Your build is too old"; \
		exit 1; \
	fi

# Commands

init:
	@source ~/.nvm/nvm.sh && \
	nvm install && \
	npm install -g yarn && \
	yarn

clean:
	@find . \
	-name node_modules -type d -prune -or \
	-name cache -type d -or \
	-name dist -type d -or \
	-name '*.bak' -type f -or \
	-name '*.log' -type f | \
	xargs rm -rf

dedupe: git-status-ok
	@yarn dedupe && \
	if [ -n "$$(git status --porcelain yarn.lock)" ]; then \
		echo "📦 yarn.lock has changed → auto commit"; \
		git add yarn.lock && \
		git commit -m "build(yarn): de-duplicate entries" && \
		git push; \
	else \
		echo "✅ yarn.lock hasn't changed"; \
	fi

license: git-status-ok license-generate license-commit

license-check:
	@./scripts/license.sh 1

license-generate:
	@./scripts/license.sh 2

license-commit:
	@./scripts/license.sh 3

wc-build:
	@./scripts/build-wc.sh
	@echo ""
	@echo "ℹ Run \`make wc-release-[patch|minor|major]\` to create a release"

wc-release-%: check-main git-status-ok
	@if ! echo "$(RELEASE_TYPES)" | grep -qw "$*"; then \
		echo "❌ Invalid release type : $*"; \
		echo "👉 Allowed types : $(RELEASE_TYPES)"; \
		exit 1; \
	fi
	@yarn workspace $(WC_PKG) run release -- $*
	@echo ""
	@echo "ℹ Run \`git push --follow-tags origin main && make wc-publish\` to publish"

wc-publish: check-main git-status-ok check-wc-build
	@yarn workspace $(WC_PKG) npm publish
