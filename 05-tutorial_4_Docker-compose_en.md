## Docker multi-container / part 2:
### Docker compose

There is several open-source tools that play very nicely with Docker.
Here are some:
1) Docker Machine: Create Docker hosts on your computer, on cloud providers and inside your own data center
2) Docker Compose: A tool for defining and running multi-container Docker applications.
3) Docker Swarm: A native clustering solution for Docker.
4) Kubernetes: Open-source system for automating deployement, scaling and management of containerized applications.

In this section, we're going to look at Docker Compose.
It provides a configuration file called `docker-compose.yml` that bring up an app and the suite of services it depends on with just a command.
And it works in all environment: Production, staging, dev, testing as well as Cl workflows, because Compose is ideal for dev and test environments.

Let's try to create a `docker-compose.yml` file for our SF-Foodtrucks app!

First step is to install Docker compose (Linux only! Mac OS & Windows is already installed)
We can do this using `pip`, since it's written in Python
    pip install docker-compose
then we test it:
    docker-compose --version

Now open the `docker-compose.yml` file. YAML syntax is rather easy to understand.
Let's explain a bit:
At parent level we have our services `es` and `web`. For each service, we can add additional parameters out of which `image` is required.
For `es`, we refer to the `elasticsearch` image available on Elastic registry.
For our Flask app, we refer to the image we've built.

With `command` and `ports`, we provide more infos about the container.
The `volumes` parameter specifies a mount point in our `web` container. It's optionnal but usefull if you need logs, etc ..
the same volume added to `es` container so that data we load persists between restarts.
We also specified `depends_on`, telling docker to start `es` container before `web`.

Now file is ready! Les see `docker-compose` in action! But before we start, names and ports must be free.
So if you have Flask and ES containers running, turn them off.
    docker stop es foodstrucks-web
    
    docker rm es foodstrucks-web
    
Navigate to the directory then
    docker-compose up
A few lines and 2 docker containers running succesfully in unison. Let's stop it an re-run in detached mode
    docker-compose up -d
Where do the names come from? Compose created them. But does Compose also create network automatically? Let's find out!
To stop we can use
    docker-compose down
Volumes and cluster will be available next time we run them. To remove both we use
    docker-compose down -v
    
We'll remove the `foodtrucks` network we created last time also
    docker network rm foodstrucks-net
Check if it's clean
    docker network ls

Great! Re-run our services and see if Compose does it's magic!!!
    docker-compose up -d
    
    docker container ls
    
Time to see for network
    docker network ls
You can see `foodtrucks_default` was created and attached both new services in that network.
    docker network inspect foodstrucks_default
    

When we started talking about Docker Compose; it was stated that it's really great for development and testing.
Let's see how we can configure compose to make our lives easier during development!

For the moment, we've used readymade docker images; we didn't touched anything but blank images and restricted ourselves to editing Dockerfiles and YAML configurations.
So, how does the workflow look during development?

Let's see how we can make a change in the Foodtrucks app we just ran.
make sure you have the app running
    docker container ls

Now, let's see if we can change this app to diplay a `Hello World!` message when a request is made to `/hello` route.
    curl -I 0.0.0.0:5000/hello
Currently, the app responds with a 404.
Why? In Flask, routes are defined with *@app.route* syntax.
In the file, only 3 routes are defined: `/`(for main app),`/debug`(some debug infos) and `/search`(used by app to query Elasticsearch)
    curl 0.0.0.0:5000/debug
How to add a route?
Let's open `flask-app/appp.py` and make some changes

```
@app.route('/')
def index():
  return render_template("index.html")

# add a new hello route
@app.route('/hello')
def hello():
  return "hello world!"
```

Let's try request again
    curl -I 0.0.0.0:5000/hello
... and still not working!
What's wrong?
We make changes to local `app.py` but since Docker is running our containers based off the `<YOUR_DOCKER_HUB_NAME>/foodstrucks-web` image, it doesn't reflect the changes.
To validate, let's fix our `docker-compose.yml` by replacing the `web` portion
```
...

web:
    build: . # replaced image with build
    command: python app.py
    environment:
      - DEBUG=True  # set an env var for flask
    depends_on:
      - es
    ports:
      - "5000:5000"
    volumes:
      - ./flask-app:/opt/flask-app

...


```

With that difference, let's stop and re-run
    docker-compose down -v
    
    docker-compose up -d

After waiting a bit, we can check this
    curl 0.0.0.0:5000/hello
    
And now it's working!!!!
