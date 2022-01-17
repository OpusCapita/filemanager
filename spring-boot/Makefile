git_root := $(shell git rev-parse --show-toplevel)
include $(git_root)/tools/makefile/help.mk

# configure-maven.sh script is expected to exist in CI image
# (which could be started via 'make container-for-code' in repo root or which is executor in CI process)
.PHONY: configure
configure:
ifneq (,$(wildcard /\.dockerenv))
	-configure-maven.sh
endif

.PHONY: build
build: configure ## Build application
	mvn deploy -e -B

.PHONY: build-locally
build-locally: configure ## Build application but don't deploy to artifactory
	mvn install -e -B
