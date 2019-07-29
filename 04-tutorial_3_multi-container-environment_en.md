## Multi-container Docker / part 1

Previously, we've seen single container with a single-page app or even how to deploy such page, but now, we'll go deeper with multi-container environments!!
App nowadays are not that simple!
There's almost always a database (or persistent storage at least) and systems like Redis or Memcached have become an *incontournable* in most web application architectures.

Why multi-container?
One key point of Docker is to provide isolation; bundling a process with its dependencies in a sandbox (called containers).

It is wise to keep containers for each of the services separate. Each tier is likely to have different resource needs that might grow at different rates.
That's why Docker and container technology is in the forefront of modern microservices architectures.

For this exemple, the app is build like this:
Backend is written in Python (Flask) and search module is using Elasticsearch.

First, let's clone the repo locally:  
`git clone https://github.com/prakhar1989/FoodTrucks`
  
`cd FoodTrucks`

Inside it, you'll find several usefull files (YAML, Dockerfile, etc ..)
We see we need 2 containers, one for Flask backend, the other one for Elasticsearch.
We previously built a Flask container so we're lookibng for a Elasticsearch.  
`docker search elasticsearch`  
    
Unsurprisingly, we've found an official Elasticsearch image. But they maintain theyr own registry so we'll use this:  
`docker pull docker.elastic.co/elasticsearch/elasticsearch:6.3.2`
then run it in dev mode, specifying ports and settings  
`docker run -d --name es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.2`
    
We use  `-- name es` to have an easy name for later commands. When it's started, we can check logs:  
`docker container logs es`
and let's try to send a request on the container/ We use 9200 port to send a cURL  
`curl 0.0.0.0:9200`

Ok! So now our search container is runnung, we're going to do the same with the Flask container.
And we need for that a Dockerfile. This time, we want `pip` install Python dependencies but we want our application to generate our minified JS file for prod.
And for that, we'll need NodeJS.
So let's start from an `Ùbuntu` base image to build our Dockerfile from scratch!!!

```
# start from base
FROM ubuntu:18.04
MAINTAINER <YOUR_NAME_AND_INFOS>

# install system-wide deps for python and node
RUN apt-get -yqq update
RUN apt-get -yqq install python-pip python-dev curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -yq nodejs

# copy our application code
ADD flask-app /opt/flask-app
WORKDIR /opt/flask-app

# fetch app specific deps
RUN npm install
RUN npm run build
RUN pip install -r requirements.txt

# expose port
EXPOSE 5000

# start app
CMD [ "python", "./app.py" ]
```

To further explain:
We start off Ubuntu LTS base image, using `apt-get` manager to install Python and Node. `yqq` flag is used to get rid of "Yes" on all prompt.
We then `ADD` app into new volume in container; our working directory. Now that system-wide dependecies are installed, we get around app-specific ones.
First Node from `npm` then Python, exposing the port and defining `CMD`

We finally go ahead and build the image.  
`docker build -t <YOUR_DOCKER_HUB_NAME>/foodtrucks-web . `  
It will take time to build it.
Now let's try running it  
`docker run -P --rm <YOUR_DOCKER_HUB_NAME>/foodtrucks-web`  

... it's not working! Our Flask app was unable to run since it was unable to connect to Elasticsearch.
How do we tell one container to communicate with other?
Using  
`Docker Network`

### Docker Network
Let's run `docker container ls` (same as `docker ps`)  
`docker container ls`
We have one ES container running on 0.0.0.0:9200 we could directly access. If we tell our Flask app to connect to this URL, it should work, right?
let's look at our Python code:  
`es = Elasticsearch(host='es')`
So it means that 0.0.0.0 host (default port 9200) is ES container running on.
But that IP (0.0.0.0) is from __host machine__, another container won't be able to access on the same IP address.

When Docker is installed, it creates three networks automatically  
`docker network ls`
    
The __bridge__ network is where containers are run by default. To validate, let's inspect  
`docker network inspect bridge`
We can see our container `es` listed under `Containers` section and that IP address is allocated.
We're going to check if it communicate correctly from this IP address:  
`docker run -it --rm <YOUR_DOCKER_HUB_NAME>/foodtrucks-web bash`  
then  
`curl 172.17.0.2:9200`  
and it communicate well!

So, we know that Flask container that `es` stands for `172.17.0.2` or it may be some other IP since IP can change?
And since Bridge network is shared by every container by default, this method isn't unsecure? How do we isolate our network?

We can use `Docker network commands`

Let's create our own network:  
`docker network create foodtrucks-net`

To use it, we'll lauch with the `--net` flag.
First, stop `es` container and remove it from running in the bridge (default) network  
`docker container stop es`

`docker container rm es`

`docker run -d --name es --net foodtrucks-net -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.2`
    
`docker network inspect foodtrucks-net`

You can see our `es` container is running inside `foodtrucks-net` bridge network.
Let's test it further:  
`docker run -it --rm --net foodtrucks-net <YOUR_DOCKER_HUB_NAME>/foodtrucks-web bash`

```
curl es:9200
ls
python app.py
```

Everything work! Containers can not only communicate by IP address but can also resolve a container name to an IP address (called *automatic service discovery*)
Gret! Let's launch our Flask container for real now!  
`docker run -d --net foodtrucks-net -p 5000:5000 --name foodtrucks-web <YOUR_DOCKER_HUB_NAME>/foodtrucks-web`
    
`docker container ls`
    
`curl -I 0.0.0.0:5000`
    
If you check on your browser @ 0.0.0.0:5000 you'll see the app live!
It seem to be a huge work but really, we only typed 4 commands to go from zero to running, here is the complete list of what we've done!

```
#!/bin/bash

# build the flask container
docker build -t <YOUR_DOCKER_HUB_NAME>/foodtrucks-web .

# create the network
docker network create foodtrucks-net

# start the ES container
docker run -d --name es --net foodtrucks-net -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.2

# start the flask app container
docker run -d --net foodtrucks-net -p 5000:5000 --name foodtrucks-web <YOUR_DOCKER_HUB_NAME>/foodtrucks-web
```
all those lines we could put on a `bash script`
(see setup-docker.sh bash script, you can modify it to change your name and account)

Doing so could lead to an easy install:  
```
git clone https://github.com/mazzinwx/FoodTrucks
cd FoodTrucks
./setup-docker.sh
```

And voilà!
