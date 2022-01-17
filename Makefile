git_root := $(shell git rev-parse --show-toplevel)
include $(git_root)/tools/makefile/help.mk
include $(git_root)/tools/makefile/executors.mk

# configure-npm.sh script is expected to exist in CI image
# (which could be started via 'make container-for-code' in repo root or which is executor in CI process)
.PHONY: configure
configure:
ifneq (,$(wildcard /\.dockerenv))
	-configure-npm.sh
endif

# docker-login.sh script is expected to exist in CI image
# (which could be started via 'make container-for-code' in repo root or which is executor in CI process)
.PHONY: docker-login
docker-login:
ifneq (,$(wildcard /\.dockerenv))
	-docker-login.sh
endif

.PHONY: js-install-deps
js-install-deps: configure ## Install JS dependencies
	npm install --unsafe-perm

.PHONY: js-lint
js-lint: configure ## Lint JS code
	npm run lint

.PHONY: js-test
js-test: configure ## Test JS code
	npm run test-restapi

.PHONY: js-build
js-build: configure ## Build JS code
	cd $(git_root)/packages/client-react && \
	npm run gh-pages:build && \
	rm -rf ../demoapp/static && \
	mkdir -p ../demoapp/static && \
	mv .gh-pages-tmp/* ../demoapp/static/

# Build server API docs

	cd $(git_root)/packages/server-nodejs && \
	npm run build-api-docs && \
	mkdir -p ../demoapp/static/api && \
	cp -r api-docs.tmp/docs ../demoapp/static/api

# Generate demo files

	mkdir -p $(git_root)/packages/demoapp/demoapp/demo-files && \
	$(git_root)/demo-filesystem/populate-demo-fs.sh $(git_root)/packages/demoapp/demo-files

.PHONY: js-publish
js-publish: configure ## Publish JS code to NPM registry
	npm run publish

.PHONY: java-build
java-build: ## Build Java code
	make -C spring-boot build

.PHONY: build-docker
build-docker: docker-login ## Build application Docker image
	$(git_root)/build/docker/application/build.sh

.PHONY: publish-docker
publish-docker: docker-login ## Publish application Docker image
	$(git_root)/build/docker/application/push.sh

.PHONY: deploy-demo
deploy-demo: ## Deploy demo to Kubernetes
	$(git_root)/build/demo/deploy.sh

# local ops

.PHONY: container-for-code
container-for-code: ## Start container for 'code'-related commands
	@$(CONTAINER_FOR_CODE)

.PHONY: container-for-deployment
container-for-deployment: ## Start container for 'deployment'-related commands
	@$(CONTAINER_FOR_DEPLOYMENT)
