Basics
-----------------------

Now that everything is installed, we can test different commands.

The first one is:
    docker run hello-world

If everything is correctly installed, Docker will pull image from the Docker registry __(Docker Hub)__, load and run the container. 

We get now a Busybox image (a binary file, heavily used in Linux and Unix environment)  
`docker pull busybox`

In case you get a `permission denied` message, you should use the `sudo` in front of it

To see all images avaible on your system, use that command:  
`docker images`

Let's run the container based on this image  
`docker run busybox`

... and nothing happens??
In fact, plenty of things are happening. With `run` command, Docker pull the image, load the container and run a command.
Since we don't give any command, the container runs and then exit.
To see how command runs, let's do this:  
`docker run busybox echo "Hello from busybox"`

The command had been executed but container exited again.

To see running container, use this command:
`docker ps`

No container is running at the moment. To see those stopped, we can do:
`docker ps -a`

It's a list of all containers we used until now.

But how to run several command in a container?
With the `-it` argument  
`docker run -it busybox sh`

A `/ #` appear, where we can type any command just like a standard bash terminal!

Let's test `ls` or `uptime`

__/!\__ 
If you're aventurous, it's possible to use, inside the container, `rm -rf bin`. After that `ls` or `echo` won't work anymore.
But don't forget that it must be done inside the container or you'll lose a lot of work or even break your system.
Just type `exit` to go outside of the container's terminal.
Use that command again  
`docker run -it busybox sh`
and your container will run normally, just like if you haven't done anything to it; because it's a brand new container each time.

More info about the `run` command:   
`docker run --help`


As a rule of thumb, you can clean up containers once uou're done with them. To do that, run the docker command

`docker rm <container_id>`
You can see the *<container_id>* with this command:
`docker ps -a`
Some characters are required to select and delete the container, you're not forced to write it completely

If you want to erase several containers at once:
`docker rm $(docker ps -a -q -f status=exited)`
The `-q` returns only numerical IDs, `-f` filters outputs on the condition `status=exited`
In later versions of Docker, that command can be achieved for the same result:
`docker container prune`
