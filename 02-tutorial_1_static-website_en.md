## Static Website

We're going to run a simple single-page website hosted on the Docker registry `prakhar1989/static-site`
With `--rm` flag, it will automatically remove the container when it exits.
    docker run --rm prakhar1989/static-site

Since it doesn't exist locally, the client will fetch it.
If everything goes well, you'll see `Nginx is running...`
So now, how to see the website? On which port is it running? And how do we access the container directly from our host machine?
Hit `Ctrl+C` to stop the container.

We must re-run `docker run` command to publish ports. And we'll find a way so that our terminal is not attached to the running container, this way we could close the terminal and keep the container running.
This is called __detached__ mode.
    docker run -d -P --name static-site prakhar1989/static-site

The container ID will be displayed. The `-d` is for detached mode, `-P` will publish all exposed ports to random ports and `--name` is the way to give the name we want.
We can see ports by running that command:
    docker port static-site

__/!\__ Those on Windows running Docker-toolbox, you might need to use `docker-machine ip default` to get the IP __/!\__

You can also specify a custom port to which the client will forward connections to the container
    docker run -d -p 8888:80 --name static-site2 prakhar1989/static-site

To stop a detached container run
    docker stop <container_ID>
In this case, we can use the name `static-site2` instead of ID
    docker stop static-site2

