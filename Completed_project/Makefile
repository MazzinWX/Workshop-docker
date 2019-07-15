# Default env vars
API_URL?=
ARGS?=
PORT?=3000

GIT_SHA=$(shell git rev-parse HEAD)
TAG=mazzinwx/docker-ui-demo
TAG_DEV=mazzinwx/docker-ui-demo-dev
VOLUME_MOUNTS= --mount source=src,target=/usr/app/src
VOLUME_MOUNTS_WITH_DEP_STUFF=$(VOLUME_MOUNTS) --mount source=yarn.lock,target=/usr/app/

all: build

build:
	docker build -t $(TAG):$(GIT_SHA) . \
		&& docker tag $(TAG):$(GIT_SHA) $(TAG):latest

build-dev:
	docker build -f dev.Dockerfile -t $(TAG_DEV):$(GIT_SHA) . \
		&& docker tag $(TAG_DEV):$(GIT_SHA) $(TAG_DEV):latest

run-dev:
	docker run -it --rm -p $(PORT):$(PORT) $(VOLUME_MOUNTS) $(TAG_DEV) \
		dev --env.api-url $(API_URL) --env.host 0.0.0.0 --env.port $(PORT) $(ARGS)

run-yarn:
	docker run -it --rm $(VOLUME_MOUNTS_WITH_DEP_STUFF) $(TAG_DEV) $(ARGS)


.PHONY: build build-dev run-dev run-yarn
