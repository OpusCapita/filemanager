git_root := $(shell git rev-parse --show-toplevel)

CONTAINER_FOR_CODE :=
CONTAINER_FOR_DEPLOYMENT :=

# if not in docker - then assign a script which gonna run corresponding image
ifeq (,$(wildcard /\.dockerenv))
CONTAINER_FOR_CODE := $(git_root)/tools/container-for-code.sh
CONTAINER_FOR_DEPLOYMENT := $(git_root)/tools/container-for-deployment.sh
endif
