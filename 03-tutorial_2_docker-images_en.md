## Tutorial 2: Docker Images

With this tutorial, we'll go deeper into what Docker images are and build our own image.
We're going to run it locally and finally deploy it.


To see a list of locally available images, use
    docker images

The `TAG` refers to a particular snapshot of the image, `IMAGE ID` is the unique identifier of that image.
Without a specific version number provided, the client defaults to `latest`
For example, you can pull a specific version of Ubuntu image
    docker pull ubuntu:18.04

There is 2 kind of images
- Base images: With no parents, usually images with an OS
- Child images: built on base images, adding functionality

And both can be Official images, typically one word long. Officially maintained and supported by Docker; or User images, created and shared by users. Typically formatted as `user/image-name`

Let's create our own first image.
We'll do an image that sandboxes a simple Flask app.
So, let's clone the repository locally with this:
    git clone https://github.com/prakhar1989/docker-curriculum.git
then
    cd docker-curriculum/flask-app

The next step is to create an image with this app.
This app is written in python, so we'll use Python 3, but more specifically, we'll use `python:3-onbuild` version.
The `onbuild` means that automation are included. A bit like an install script.
Here, it'll COPY a `requirements.txt` file, RUN `pip install` and COPY current directory into `/usr/src/app`

We need now a Dockerfile!
It's a simple text file that contains a list of commands.
So let's do this!
Starting a blank text page we're going to save to the same folder as the flask app; using the name `Dockerfile`

We specify our base image
    FROM python:3-onbuild
Usually, next step is writing commands of copying files and installing dependencies. But `onbuild` version already took care of that.
We specify the port needed to be exposed. Out flask app is running on port 5000, so let's do this
    EXPOSE 5000
Last thing is write the command to run the app
    CMD ["python", "./app.py"]
Save it and now we're ready to build our image.
