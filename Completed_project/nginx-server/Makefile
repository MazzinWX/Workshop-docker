all: build

build:
	docker build -t mazzinwx/docker-nginx-demo .

run:
	docker run -it --rm -p 8000:80 mazzinwx/docker-nginx-demo

.PHONY: build run